/**
 * Gmail transport via the Gmail REST API (no googleapis dependency — just the
 * OAuth2 refresh-token flow + fetch). Implements the MailAdapter contract, so
 * the sender never knows whether it's really sending, drafting, or dry-running.
 *
 * Auth: a long-lived refresh token (generated once, see MANUAL_SETUP.md) is
 * exchanged for a short-lived access token on demand. Secrets come from env
 * vars only and are never logged.
 */
import type { GmailEnv, MailAdapter, MailMessage, MailResult, OutreachConfig } from "./types";
import { hasGmailCreds } from "./config";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

/** RFC 2047 encode a header value so Turkish characters survive. */
function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

/** Build a base64url-encoded RFC 2822 message for the Gmail API. */
function buildRawMessage(from: string, msg: MailMessage): string {
  const headers = [
    `From: ${from}`,
    `To: ${msg.to}`,
    `Subject: ${encodeHeader(msg.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
  ];
  const raw = `${headers.join("\r\n")}\r\n\r\n${msg.body}`;
  return Buffer.from(raw, "utf8").toString("base64url");
}

/** fetch() with an AbortController timeout so a hung Gmail socket can't stall a run. */
async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** A no-op adapter used in dry-run mode: generates everything, sends nothing. */
export class DryRunAdapter implements MailAdapter {
  readonly mode = "dry-run" as const;
  async deliver(_message: MailMessage): Promise<MailResult> {
    return { ok: true, mode: "dry-run", messageId: `dry-${Date.now()}` };
  }
}

/** Real Gmail adapter. mode is "send" or "draft". */
export class GmailClient implements MailAdapter {
  readonly mode: "send" | "draft";
  private env: GmailEnv;
  private config: OutreachConfig;
  private accessToken = "";
  private tokenExpiresAt = 0;
  private cachedLabelId: string | null = null;

  constructor(env: GmailEnv, config: OutreachConfig, mode: "send" | "draft") {
    this.env = env;
    this.config = config;
    this.mode = mode;
  }

  /** Exchange the refresh token for an access token (cached until ~expiry). */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) return this.accessToken;
    const body = new URLSearchParams({
      client_id: this.env.clientId,
      client_secret: this.env.clientSecret,
      refresh_token: this.env.refreshToken,
      grant_type: "refresh_token",
    });
    const res = await fetchWithTimeout(
      TOKEN_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
      this.config.requestTimeoutMs,
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gmail token yenileme başarısız (${res.status}): ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as { access_token: string; expires_in: number };
    this.accessToken = json.access_token;
    this.tokenExpiresAt = Date.now() + (json.expires_in - 60) * 1000;
    return this.accessToken;
  }

  private async api(path: string, init: RequestInit): Promise<Response> {
    const token = await this.getAccessToken();
    return fetchWithTimeout(
      `${API_BASE}${path}`,
      {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
      },
      this.config.requestTimeoutMs,
    );
  }

  async deliver(message: MailMessage): Promise<MailResult> {
    const from = `${this.config.senderName} <${this.env.senderEmail}>`;
    const raw = buildRawMessage(from, message);
    try {
      const id =
        this.mode === "send" ? await this.sendRaw(raw) : await this.createDraft(raw);
      // Best-effort labeling; never fail the send because of a label error.
      if (this.mode === "send") await this.tryLabel(id);
      return { ok: true, mode: this.mode, messageId: id };
    } catch (err) {
      return { ok: false, mode: this.mode, messageId: "", error: (err as Error).message };
    }
  }

  private async sendRaw(raw: string): Promise<string> {
    const res = await this.api("/messages/send", {
      method: "POST",
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) throw new Error(`send hatası (${res.status}): ${(await res.text()).slice(0, 200)}`);
    const json = (await res.json()) as { id: string };
    return json.id;
  }

  private async createDraft(raw: string): Promise<string> {
    const res = await this.api("/drafts", {
      method: "POST",
      body: JSON.stringify({ message: { raw } }),
    });
    if (!res.ok) throw new Error(`draft hatası (${res.status}): ${(await res.text()).slice(0, 200)}`);
    const json = (await res.json()) as { id: string };
    return json.id;
  }

  /** Ensure the outreach label exists and return its id (cached). */
  private async ensureLabel(): Promise<string | null> {
    if (this.cachedLabelId) return this.cachedLabelId;
    const listRes = await this.api("/labels", { method: "GET" });
    if (!listRes.ok) return null;
    const { labels } = (await listRes.json()) as { labels: { id: string; name: string }[] };
    const existing = labels?.find((l) => l.name === this.config.gmailLabel);
    if (existing) {
      this.cachedLabelId = existing.id;
      return existing.id;
    }
    const createRes = await this.api("/labels", {
      method: "POST",
      body: JSON.stringify({ name: this.config.gmailLabel, labelListVisibility: "labelShow", messageListVisibility: "show" }),
    });
    if (!createRes.ok) return null;
    const created = (await createRes.json()) as { id: string };
    this.cachedLabelId = created.id;
    return created.id;
  }

  private async tryLabel(messageId: string): Promise<void> {
    try {
      const labelId = await this.ensureLabel();
      if (!labelId) return;
      await this.api(`/messages/${messageId}/modify`, {
        method: "POST",
        body: JSON.stringify({ addLabelIds: [labelId] }),
      });
    } catch {
      /* labeling is best-effort */
    }
  }

  /**
   * Search recent messages for possible replies. Returns matching message
   * snippets. Best-effort — used by the reply-tracking helper.
   */
  async searchReplies(query: string): Promise<{ id: string; snippet: string }[]> {
    const res = await this.api(`/messages?q=${encodeURIComponent(query)}&maxResults=25`, {
      method: "GET",
    });
    if (!res.ok) return [];
    const { messages } = (await res.json()) as { messages?: { id: string }[] };
    if (!messages) return [];
    const out: { id: string; snippet: string }[] = [];
    for (const m of messages) {
      const detail = await this.api(`/messages/${m.id}?format=metadata`, { method: "GET" });
      if (detail.ok) {
        const d = (await detail.json()) as { id: string; snippet?: string };
        out.push({ id: d.id, snippet: d.snippet ?? "" });
      }
    }
    return out;
  }

  /**
   * Richer reply search for the inbox module: returns From/Subject/Date headers
   * + snippet for each matching message. Best-effort; returns [] on any error.
   */
  async listReplyMessages(
    query: string,
    max = 25,
  ): Promise<{ id: string; from: string; subject: string; snippet: string; date: string }[]> {
    const res = await this.api(
      `/messages?q=${encodeURIComponent(query)}&maxResults=${max}`,
      { method: "GET" },
    );
    if (!res.ok) return [];
    const { messages } = (await res.json()) as { messages?: { id: string }[] };
    if (!messages) return [];
    const out: { id: string; from: string; subject: string; snippet: string; date: string }[] = [];
    for (const m of messages) {
      const detail = await this.api(
        `/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        { method: "GET" },
      );
      if (!detail.ok) continue;
      const d = (await detail.json()) as {
        id: string;
        snippet?: string;
        payload?: { headers?: { name: string; value: string }[] };
      };
      const headers = d.payload?.headers ?? [];
      const h = (name: string) =>
        headers.find((x) => x.name.toLowerCase() === name.toLowerCase())?.value ?? "";
      out.push({
        id: d.id,
        from: h("From"),
        subject: h("Subject"),
        snippet: d.snippet ?? "",
        date: h("Date"),
      });
    }
    return out;
  }
}

/**
 * Build a read-only Gmail client for the inbox module (reuses send creds).
 * Returns null when Gmail credentials are missing.
 */
export function createGmailReader(config: OutreachConfig, env: GmailEnv): GmailClient | null {
  if (!hasGmailCreds(env)) return null;
  return new GmailClient(env, config, "send");
}

/** Reason a real adapter could not be built (for setup messaging). */
export class MissingCredsError extends Error {}

/**
 * Choose the adapter for this run:
 *  - dry-run mode          -> DryRunAdapter (nothing is sent)
 *  - creds present         -> GmailClient (send if autoSendEnabled, else draft)
 *  - creds missing (live)  -> throws MissingCredsError (sender explains setup)
 */
export function getMailAdapter(config: OutreachConfig, env: GmailEnv): MailAdapter {
  if (config.dryRun) return new DryRunAdapter();
  if (!hasGmailCreds(env)) {
    throw new MissingCredsError(
      "Gmail kimlik bilgileri eksik. `npm run outreach:setup-check` çalıştırın veya dryRun'ı true yapın.",
    );
  }
  return new GmailClient(env, config, config.autoSendEnabled ? "send" : "draft");
}
