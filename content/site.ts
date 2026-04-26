import type { SocialLink } from "@/types/content";

export const siteConfig = {
  name: "Jackie Ye",
  title: "Jackie Ye - Full Stack Developer",
  description:
    "Full stack developer building digital products from idea to deployment. Every encounter is meaningful.",
  url: "https://jackieye.dev",
  email: "hi@jackieye.dev",
  logoText: "J-Y",
  tagline: "Every encounter is meaningful.",
  chineseTagline: "每一次相遇，都是缘分。",
  social: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    resume: "#",
  },
} as const;

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Resume", href: siteConfig.social.resume },
];
