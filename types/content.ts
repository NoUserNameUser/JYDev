export type ActionLink = {
  label: string;
  href: string;
};

export type SocialLink = ActionLink;

export type SEOContent = {
  title: string;
  description: string;
  image?: string;
};

export type HeroMetric = {
  value: string;
  suffix?: string;
  label: string;
};

export type HeroContent = {
  eyebrow: string;
  titleLines: string[];
  highlightedTitleLine: string;
  descriptionPrefix: string;
  descriptionStrong: string;
  descriptionSuffix: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
  metrics: HeroMetric[];
};

export type ValueItem = {
  icon: string;
  title: string;
  description: string;
};

export type ServicePillar = {
  number: string;
  title: string;
  body: string;
  tags: string[];
};

export type ExperienceItem = {
  year: string;
  company: string;
  type: string;
  role: string;
  current?: boolean;
  bullets: string[];
  chips: string[];
  delay: number;
};

export type ContactContent = {
  eyebrow: string;
  titleLines: string[];
  descriptionPrefix: string;
  descriptionStrong: string;
  descriptionSuffix: string;
  email: string;
};
