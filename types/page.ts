import type { NavigationLink } from "./navigation";
import type { SEO } from "./seo";

export type HeroSection = {
  __component: "sections.hero";
  eyebrow?: string;
  heading: string;
  body?: string;
  primaryAction?: NavigationLink;
  secondaryAction?: NavigationLink;
  visible?: boolean;
};

export type TextImageSection = {
  __component: "sections.text-image";
  eyebrow?: string;
  heading: string;
  body?: string;
  imagePosition?: "left" | "right";
  visible?: boolean;
};

export type CTASection = {
  __component: "sections.cta";
  heading: string;
  body?: string;
  action: NavigationLink;
  visible?: boolean;
};

export type FAQSection = {
  __component: "sections.faq";
  heading?: string;
  items: Array<{ question: string; answer: string }>;
  visible?: boolean;
};

export type DynamicSection = HeroSection | TextImageSection | CTASection | FAQSection;

export type CMSPage = {
  title: string;
  slug: string;
  seo?: SEO;
  sections: DynamicSection[];
};
