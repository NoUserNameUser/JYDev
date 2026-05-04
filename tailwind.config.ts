import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "var(--container-padding-x)",
        sm: "24px",
        lg: "48px",
        xl: "72px",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          editorial: "#EDEAE0",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          soft: "var(--color-primary-soft)",
        },
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        muted: {
          DEFAULT: "var(--color-muted)",
          strong: "var(--color-muted-strong)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        cream: "#F6F3EC",
        bark: "#1a1712",
        gold: "#a07c28",
        sun: "#c9a24a",
        sage: "#4a7a6a",
        mist: "#E4E1D7",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        focus: "0 0 0 3px var(--color-primary-soft-hover)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.18)",
      },
      spacing: {
        section: "var(--section-padding-y)",
        "section-gap": "var(--section-heading-gap)",
      },
      zIndex: {
        header: "50",
        overlay: "80",
        modal: "100",
      },
    },
  },
  plugins: [],
};
export default config;
