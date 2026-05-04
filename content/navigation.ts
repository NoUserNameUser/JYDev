import type { ActionLink } from "@/types/content";

export const mainNavigation: ActionLink[] = [
  { href: "#about", label: "About" },
  { href: "#build", label: "Build" },
  { href: "#experience", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export const navigationCta: ActionLink = {
  label: "Start",
  href: "#contact",
};
