import type { Metadata } from "next";
import LegalLayout from "@/app/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Content Machine",
  description:
    "Privacy Policy for Content Machine, an AI-powered autonomous content operating system.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base text-gray-600 leading-relaxed">{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-1.5 text-base text-gray-600">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function ContentMachinePrivacy() {
  return (
    <LegalLayout
      projectName="Content Machine"
      projectSlug="content-machine"
      pageType="privacy"
      lastUpdated="June 18, 2026"
    >
      <Section title="1. Overview">
        <P>
          Content Machine is an AI-powered autonomous content operating system
          created and operated by Cenk Emir Bat. It generates short-form video
          content, creates scripts automatically using AI, schedules publishing,
          and collects performance analytics — all on your behalf.
        </P>
        <P>
          This Privacy Policy explains what information Content Machine
          collects, how it is used, and what rights you have. By using Content
          Machine, you agree to the practices described below.
        </P>
      </Section>

      <Section title="2. Information We Collect">
        <P>
          Content Machine collects only the information necessary to operate
          the service on your behalf.
        </P>
        <P>
          <span className="font-medium text-gray-700">
            OAuth access tokens.
          </span>{" "}
          When you connect a social media account, Content Machine receives an
          OAuth access token issued by that platform (Google for YouTube,
          TikTok for TikTok). These tokens are used exclusively to act on your
          behalf — publishing content, reading analytics, and managing
          uploads.
        </P>
        <P>
          <span className="font-medium text-gray-700">Account identifiers.</span>{" "}
          Platform-assigned identifiers (such as a YouTube channel ID or TikTok
          user ID) are stored to associate published content with your account.
        </P>
        <P>
          <span className="font-medium text-gray-700">
            Video metadata and publishing information.
          </span>{" "}
          Titles, descriptions, tags, upload timestamps, and platform-assigned
          video IDs are stored to track published content.
        </P>
        <P>
          <span className="font-medium text-gray-700">
            Performance analytics and engagement metrics.
          </span>{" "}
          Views, watch time, likes, comments, shares, and similar engagement
          data are retrieved from connected platforms and used to improve
          content performance.
        </P>
        <P>
          Content Machine does not collect payment information, sensitive
          personal information, or any data beyond what is described above.
        </P>
      </Section>

      <Section title="3. How We Use Your Information">
        <P>Information collected is used solely for the following purposes:</P>
        <Ul
          items={[
            "Generating scripts and producing short-form video content on your behalf",
            "Publishing content to your connected social media accounts",
            "Scheduling content publishing based on optimal timing",
            "Retrieving performance analytics to measure content effectiveness",
            "Improving content recommendations, scheduling decisions, and generation quality",
            "Maintaining a record of published content and its performance",
          ]}
        />
        <P>
          Your data is never sold, licensed, or shared with third parties for
          advertising, marketing, or any commercial purpose.
        </P>
      </Section>

      <Section title="4. Third-Party Platforms">
        <P>
          Content Machine integrates with third-party platforms through their
          official APIs. Your use of those platforms is also governed by their
          own privacy policies and terms of service.
        </P>
        <Ul
          items={[
            "YouTube / Google — https://policies.google.com/privacy",
            "TikTok — https://www.tiktok.com/legal/privacy-policy",
          ]}
        />
        <P>
          Content Machine uses Google's OAuth 2.0 flow to request scoped access
          to your YouTube account. Access is limited to the specific scopes
          required for publishing and analytics. Content Machine's use of
          information received from Google APIs adheres to the{" "}
          <span className="font-medium text-gray-700">
            Google API Services User Data Policy
          </span>
          , including the Limited Use requirements.
        </P>
      </Section>

      <Section title="5. Data Retention">
        <P>
          OAuth tokens are retained only as long as the connected account
          remains active. You may revoke access at any time through the
          connected platform's account settings (for example, Google Account
          Permissions or TikTok Connected Apps), which will invalidate the
          token immediately.
        </P>
        <P>
          Analytics and content metadata are retained to maintain a historical
          record of published content and performance. You may request deletion
          at any time by contacting us.
        </P>
      </Section>

      <Section title="6. Your Rights">
        <P>
          Depending on your location, you may have the following rights
          regarding your personal data:
        </P>
        <Ul
          items={[
            "Right of access — request a copy of the data held about you",
            "Right to rectification — request correction of inaccurate data",
            "Right to erasure — request deletion of your data",
            "Right to restrict processing — request that processing be limited",
            "Right to data portability — receive your data in a structured format",
            "Right to object — object to processing based on legitimate interests",
          ]}
        />
        <P>
          To exercise any of these rights, contact us at the address listed
          below. We will respond within 30 days.
        </P>
      </Section>

      <Section title="7. Data Security">
        <P>
          Content Machine applies reasonable technical measures to protect the
          information it stores, including secure storage of OAuth tokens and
          access controls. However, no system is completely secure, and we
          cannot guarantee absolute security.
        </P>
      </Section>

      <Section title="8. Children's Privacy">
        <P>
          Content Machine is not intended for use by individuals under the age
          of 13 (or the applicable minimum age in your jurisdiction). We do not
          knowingly collect personal information from children.
        </P>
      </Section>

      <Section title="9. Changes to This Policy">
        <P>
          This Privacy Policy may be updated from time to time. The "Last
          updated" date at the top of this page reflects the most recent
          revision. Continued use of Content Machine after changes are posted
          constitutes acceptance of the revised policy.
        </P>
      </Section>

      <Section title="10. Contact">
        <P>
          For questions, data requests, or concerns regarding this Privacy
          Policy, please contact:
        </P>
        <P>
          <span className="font-medium text-gray-700">Cenk Emir Bat</span>
          <br />
          Email: cenkemirbat@gmail.com
        </P>
      </Section>
    </LegalLayout>
  );
}
