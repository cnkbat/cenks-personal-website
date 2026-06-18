import type { Metadata } from "next";
import LegalLayout from "@/app/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Content Machine",
  description:
    "Terms of Service for Content Machine, an AI-powered autonomous content operating system.",
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

export default function ContentMachineTerms() {
  return (
    <LegalLayout
      projectName="Content Machine"
      projectSlug="content-machine"
      pageType="terms"
      lastUpdated="June 18, 2026"
    >
      <Section title="1. Acceptance of Terms">
        <P>
          By accessing or using Content Machine, you agree to be bound by these
          Terms of Service. If you do not agree to these terms, do not use the
          service.
        </P>
        <P>
          These terms apply to all users of Content Machine. Cenk Emir Bat
          reserves the right to update these terms at any time. Continued use
          of the service after changes are posted constitutes acceptance of the
          revised terms.
        </P>
      </Section>

      <Section title="2. Service Description">
        <P>
          Content Machine is an AI-powered autonomous content operating system
          created and operated by Cenk Emir Bat. The service is designed to:
        </P>
        <Ul
          items={[
            "Generate short-form video scripts using artificial intelligence",
            "Produce videos automatically based on generated scripts",
            "Schedule and publish content to connected social media accounts",
            "Collect and analyze content performance data",
            "Apply learned insights to improve future content strategies",
          ]}
        />
        <P>
          Content Machine currently supports YouTube Shorts and TikTok. Support
          for additional platforms may be added in the future.
        </P>
        <P>
          Content Machine is a personal project and is provided as-is. There
          is no guarantee of availability, uptime, or continuity of service.
        </P>
      </Section>

      <Section title="3. User Responsibilities">
        <P>By using Content Machine, you agree to:</P>
        <Ul
          items={[
            "Provide accurate information when connecting social media accounts",
            "Ensure you have the rights to any content or assets submitted to the service",
            "Comply with all applicable laws and regulations",
            "Not use the service to produce or publish content that is illegal, harmful, defamatory, or in violation of any third-party rights",
            "Not attempt to reverse engineer, disassemble, or otherwise exploit the service",
            "Not use the service in a way that could damage, overload, or impair its functionality",
          ]}
        />
        <P>
          You are solely responsible for all content published through your
          connected accounts. Content Machine acts as a tool — you remain the
          account holder and content owner.
        </P>
      </Section>

      <Section title="4. Platform Compliance">
        <P>
          Content Machine operates through the official APIs of third-party
          platforms. Your use of Content Machine must comply with the terms of
          service of all connected platforms:
        </P>
        <Ul
          items={[
            "YouTube Terms of Service — https://www.youtube.com/t/terms",
            "Google APIs Terms of Service — https://developers.google.com/terms",
            "TikTok Terms of Service — https://www.tiktok.com/legal/terms-of-service",
            "TikTok Developer Terms of Service — https://developers.tiktok.com/terms",
          ]}
        />
        <P>
          Content Machine will not be used to circumvent, violate, or abuse
          any platform's policies. Any actions taken by a platform against your
          account as a result of content published through Content Machine
          remain your sole responsibility.
        </P>
        <P>
          Content Machine's use of Google user data is limited to the purposes
          described in this document and complies with the Google API Services
          User Data Policy, including the Limited Use requirements.
        </P>
      </Section>

      <Section title="5. Intellectual Property">
        <P>
          All software, code, systems, and processes that comprise Content
          Machine are the intellectual property of Cenk Emir Bat. Nothing in
          these terms grants you any rights to the underlying software or
          infrastructure.
        </P>
        <P>
          Content generated and published through Content Machine on your
          behalf is attributed to your connected accounts. You retain ownership
          of your accounts and the content published to them.
        </P>
        <P>
          AI-generated scripts and content produced by Content Machine may draw
          on general language model capabilities. You acknowledge that
          AI-generated content may not be wholly original and accept
          responsibility for reviewing published content as appropriate.
        </P>
      </Section>

      <Section title="6. Disclaimer of Warranties">
        <P>
          Content Machine is provided "as is" and "as available" without
          warranty of any kind, either express or implied, including but not
          limited to warranties of merchantability, fitness for a particular
          purpose, or non-infringement.
        </P>
        <P>
          Cenk Emir Bat does not warrant that the service will be uninterrupted,
          error-free, or free of harmful components. Use of the service is at
          your own risk.
        </P>
      </Section>

      <Section title="7. Limitation of Liability">
        <P>
          To the fullest extent permitted by applicable law, Cenk Emir Bat
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including but not limited to loss
          of profits, data, goodwill, or account standing, arising out of or
          in connection with your use of Content Machine.
        </P>
        <P>
          This limitation applies regardless of the legal theory under which
          such damages are sought, even if Cenk Emir Bat has been advised of
          the possibility of such damages.
        </P>
      </Section>

      <Section title="8. Termination">
        <P>
          Cenk Emir Bat reserves the right to suspend or terminate access to
          Content Machine at any time, for any reason, without notice.
        </P>
        <P>
          You may stop using Content Machine at any time and revoke OAuth access
          through the settings of each connected platform. Revoking access will
          prevent Content Machine from acting on your accounts going forward.
        </P>
        <P>
          Upon termination, any obligations that by their nature should survive
          (including intellectual property, disclaimer, and limitation of
          liability provisions) will continue to apply.
        </P>
      </Section>

      <Section title="9. Governing Law">
        <P>
          These terms are governed by and construed in accordance with
          applicable law. Any disputes arising from these terms or your use of
          Content Machine shall be resolved through good-faith negotiation
          before any formal proceedings.
        </P>
      </Section>

      <Section title="10. Contact">
        <P>
          For questions or concerns regarding these Terms of Service, please
          contact:
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
