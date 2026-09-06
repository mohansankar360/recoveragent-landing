import {
  RECOVERY_PATHS,
  type RecoveryPath,
} from "@/lib/recovery-paths-data";

const USE_CASE_SLUG_BY_PATH: Record<RecoveryPath["id"], string> = {
  cod: "cod-verification",
  abandoned: "abandoned-checkout-recovery",
  ndr: "ndr-recovery",
};

export function getUseCaseSlugForPath(pathId: RecoveryPath["id"]): string {
  return USE_CASE_SLUG_BY_PATH[pathId];
}

export const SITE_USE_CASES = [
  {
    slug: USE_CASE_SLUG_BY_PATH.cod,
    pathId: "cod" as const,
    navLabel: RECOVERY_PATHS[1].label,
    title: `${RECOVERY_PATHS[1].headline} for Indian D2C brands`,
    description: RECOVERY_PATHS[1].description,
    sitemapPriority: 0.88,
  },
  {
    slug: USE_CASE_SLUG_BY_PATH.abandoned,
    pathId: "abandoned" as const,
    navLabel: RECOVERY_PATHS[0].label,
    title: `${RECOVERY_PATHS[0].headline} for Indian D2C brands`,
    description: RECOVERY_PATHS[0].description,
    sitemapPriority: 0.88,
  },
  {
    slug: USE_CASE_SLUG_BY_PATH.ndr,
    pathId: "ndr" as const,
    navLabel: RECOVERY_PATHS[2].label,
    title: `${RECOVERY_PATHS[2].headline} for Indian D2C brands`,
    description: RECOVERY_PATHS[2].description,
    sitemapPriority: 0.88,
  },
] as const;

export type SiteUseCase = (typeof SITE_USE_CASES)[number];
export type SiteUseCaseSlug = SiteUseCase["slug"];

const useCaseBySlug = new Map<string, SiteUseCase>(
  SITE_USE_CASES.map((useCase) => [useCase.slug, useCase])
);

export function getSiteUseCase(slug: string): SiteUseCase | undefined {
  return useCaseBySlug.get(slug);
}

export function getAllSiteUseCaseSlugs(): SiteUseCaseSlug[] {
  return SITE_USE_CASES.map((useCase) => useCase.slug);
}

export function getRecoveryPathForUseCase(useCase: SiteUseCase): RecoveryPath {
  return RECOVERY_PATHS.find((path) => path.id === useCase.pathId)!;
}
