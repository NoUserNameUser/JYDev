export type NavigationLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type Navigation = {
  name: string;
  items: NavigationLink[];
};
