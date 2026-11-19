import { SubPage } from "./TrialSubPages";

export function PageShell({
  navLabel,
  title,
  description,
  showCtas,
  showHero,
  finalFirst,
  children,
}: {
  navLabel: string;
  title?: string;
  description?: string;
  showCtas?: boolean;
  showHero?: boolean;
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
      showHero={showHero}
      finalFirst={finalFirst}
    >
      {children}
    </SubPage>
  );
}
