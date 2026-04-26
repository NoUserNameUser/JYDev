import type { ActionLink } from "@/types/content";

export const mainNavigation: ActionLink[] = [
  { href: "#about", label: "About" },
  { href: "#build", label: "Services" },
  { href: "#experience", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export const navigationCta: ActionLink = {
  label: "Let's Connect",
  href: "#contact",
};
