export type GridKind = "hero" | "image" | "text" | "index" | "quote";

export type GridElement =
  | {
      type: "background";
      color?: string;
      imageSrc?: string;
      imageAlt?: string;
      imageOpacity?: number;
    }
  | {
      type: "text";
      eyebrow?: string;
      heading?: string;
      body?: string;
    }
  | {
      type: "image";
      src: string;
      alt?: string;
      caption?: string;
      placement?: "inline" | "background";
    }
  | {
      type: "link";
      label: string;
      href: string;
      openInNewTab?: boolean;
    }
  | {
      type: "button";
      label: string;
      href: string;
      variant?: "primary" | "secondary" | "text";
      openInNewTab?: boolean;
    }
  | {
      type: "shape";
      name?: string;
      shape?: "triangle" | "circle" | "rectangle";
      color?: string;
      opacity?: number;
      width?: string;
      height?: string;
      x?: string;
      y?: string;
      rotation?: number;
      zIndex?: number;
    };

export type GridSection = {
  id: string;
  label: string;
  kicker: string;
  meta: string;
  kind: GridKind;
  elements?: GridElement[];
  localCss?: string;
  orderIndex: number;
};

export type SpiralPosition = {
  col: number;
  row: number;
};
