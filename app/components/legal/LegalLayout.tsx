import Link from "next/link";

interface LegalLayoutProps {
  projectName: string;
  projectSlug: string;
  pageType: "privacy" | "terms";
  lastUpdated: string;
  children: React.ReactNode;
}

const pageLabels = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

const otherPage = {
  privacy: "terms",
  terms: "privacy",
} as const;

export default function LegalLayout({
  projectName,
  projectSlug,
  pageType,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  const title = pageLabels[pageType];
  const other = otherPage[pageType];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Home
            </Link>
          </div>
          <span className="text-sm text-gray-400">{projectName}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">
            {projectName}
          </p>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">{title}</h1>
          <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-10 text-gray-700 leading-relaxed">{children}</div>
      </main>

      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>
            {projectName} · {title}
          </span>
          <Link
            href={`/${projectSlug}/${other}`}
            className="hover:text-gray-600 transition-colors"
          >
            {pageLabels[other]} →
          </Link>
        </div>
      </footer>
    </div>
  );
}
