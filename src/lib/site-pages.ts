import {
  getAllSiteSectionSlugs,
  getSiteSection,
  type SiteSection,
} from "@/lib/site-sections";
import {
  getAllSiteUseCaseSlugs,
  getSiteUseCase,
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
