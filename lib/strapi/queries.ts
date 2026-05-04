export const gridSectionsQuery =
  "/api/grids?sort=orderIndex:asc&pagination[pageSize]=100&populate=elements";

export const pageBySlugQuery = (slug: string) => {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
    populate: "seo.ogImage,sections,sections.image,sections.primaryAction,sections.secondaryAction,sections.action",
  });

  return `/api/pages?${params.toString()}`;
};

export const globalSettingsQuery = "/api/global-setting?populate=defaultSeo.ogImage,socialLinks";

export const navigationByNameQuery = (name: string) => {
  const params = new URLSearchParams({
    "filters[name][$eq]": name,
    "pagination[pageSize]": "1",
    populate: "items",
  });

  return `/api/navigations?${params.toString()}`;
};
