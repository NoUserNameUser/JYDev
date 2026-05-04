import type { SocialLink } from "@/types/content";

export const siteConfig = {
  name: "Jackie Ye",
  title: "Jackie Ye - Interactive Full Stack Developer",
  description:
    "Full stack developer building playful digital products from idea to deployment.",
  url: "https://jackiey.me",
  email: "find.jackie@yahoo.com",
  logoText: "JY",
  tagline: "Useful products can still feel playful.",
  chineseTagline: "每一次相遇，都是缘分。",
  social: {
    github: "https://github.com/NoUserNameUser",
    linkedin: "https://www.linkedin.com/in/jackie-ye-77b37b70/",
    resume: "#",
  },
} as const;

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: siteConfig.social.github },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Resume", href: siteConfig.social.resume },
];
