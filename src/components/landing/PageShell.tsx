import { SubPage } from "./TrialSubPages";

export function PageShell({
  navLabel,
  title,
  description,
  showCtas,
  finalFirst,
  children,
}: {
  navLabel: string;
  title?: string;
  description?: string;
  showCtas?: boolean;
  finalFirst?: boolean;
  children: React.ReactNode;
}) {
  return (
    <SubPage
      crumbs={[{ href: "/", label: "Home" }, { label: navLabel }]}
      eyebrow={navLabel}
      title={title ?? navLabel}
      description={description}
      showCtas={showCtas}
      finalFirst={finalFirst}
    >
      {children}
    </SubPage>
  );
}
