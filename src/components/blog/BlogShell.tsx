import { SubPage } from "@/components/landing/TrialSubPages";

export function BlogShell({
  crumbs,
  eyebrow,
  title,
  description,
  children,
}: {
  crumbs: { href?: string; label: string }[];
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <SubPage crumbs={crumbs} eyebrow={eyebrow} title={title} description={description} showCtas={false}>
      {children}
    </SubPage>
  );
}
