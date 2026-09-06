import {
  getAllSiteSectionSlugs,
  getSiteSection,
  SITE_SECTIONS,
  type SiteSection,
} from "@/lib/site-sections";
import {
  getAllSiteUseCaseSlugs,
  getSiteUseCase,
  SITE_USE_CASES,
  type SiteUseCase,
} from "@/lib/site-use-cases";

export type PublicPage =
  | { type: "section"; page: SiteSection }
  | { type: "use-case"; page: SiteUseCase };

export function resolvePublicPage(slug: string): PublicPage | undefined {
  const section = getSiteSection(slug);
  if (section) return { type: "section", page: section };

  const useCase = getSiteUseCase(slug);
  if (useCase) return { type: "use-case", page: useCase };

  return undefined;
}

export function getAllPublicSlugs(): string[] {
  return [...getAllSiteSectionSlugs(), ...getAllSiteUseCaseSlugs()];
}

export interface RelatedPage {
  slug: string;
  label: string;
  description: string;
}

export function getRelatedPages(currentSlug: string): RelatedPage[] {
  const pages: RelatedPage[] = [
    ...SITE_USE_CASES.map((useCase) => ({
      slug: useCase.slug,
      label: useCase.navLabel,
      description: useCase.description,
    })),
    ...SITE_SECTIONS.filter((section) => section.slug !== "book-demo").map(
      (section) => ({
        slug: section.slug,
        label: section.navLabel,
        description: section.description,
      })
    ),
  ];

  return pages.filter((page) => page.slug !== currentSlug);
}
