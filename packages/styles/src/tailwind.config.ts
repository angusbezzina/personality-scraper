import type { Config } from "tailwindcss";

export const config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "../components/src/**/*.{ts,tsx}",
    "../web/src/app/**/*.{ts,tsx}",
  ],
  theme: {

    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      jumbo: ["var(--text-jumbo-size)", "var(--text-jumbo-leading)"],
      xl: ["var(--text-xl-size)", "var(--text-xl-leading)"],
      h1: ["var(--text-h1-size)", "var(--text-h1-leading)"],
      h2: ["var(--text-h2-size)", "var(--text-h2-leading)"],
      h3: ["var(--text-h3-size)", "var(--text-h3-leading)"],
      h4: ["var(--text-h4-size)", "var(--text-h4-leading)"],
      lead: ["var(--text-lead-size)", "var(--text-lead-leading)"],
      large: ["var(--text-large-size)", "var(--text-large-leading)"],
      p: ["var(--text-p-size)", "var(--text-p-leading)"],
      "p-ui": ["var(--text-p-ui-size)", "var(--text-p-ui-leading)"],
      form: ["var(--text-form-size)", "var(--text-form-leading)"],
      "form-small": ["var(--text-form-small-size)", "var(--text-form-small-leading)"],
      list: ["var(--text-list-size)", "var(--text-list-leading)"],
      body: ["var(--text-body-size)", "var(--text-body-leading)"],
      subtle: ["var(--text-subtle-size)", "var(--text-subtle-leading)"],
      small: ["var(--text-small-size)", "var(--text-small-leading)"],
      detail: ["var(--text-detail-size)", "var(--text-detail-leading)"],
      blockquote: ["var(--text-blockquote-size)", "var(--text-blockquote-leading)"],
      "inline-code": ["var(--text-inline-code-size)", "var(--text-inline-code-leading)"],
      "table-head": ["var(--text-table-head-size)", "var(--text-table-head-leading)"],
      "table-item": ["var(--text-table-item-size)", "var(--text-table-item-leading)"],
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    fontFamily: {
      heading: ["var(--font-heading)", "monospace"],
      special: ["var(--font-special)", "monospace"],
      body: ["var(--font-body)", "monospace"],
      form: ["var(--font-form)", "sans-serif"],
    },
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      white: "#fff",
      black: "#000",
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      highlight: "hsl(var(--highlight))",
      hyperlink: "hsl(var(--hyperlink))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      brand: "hsl(var(--brand))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
        hover: "hsl(var(--primary-hover))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
        hover: "hsl(var(--secondary-hover))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
        hover: "hsl(var(--destructive-hover))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      faint: {
        DEFAULT: "hsl(var(--faint))",
        foreground: "hsl(var(--faint-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    extend: {
      aria: {
        invalid: 'invalid="true"',
      },
      screens: {
        xs: "480px",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 2px)",
        DEFAULT: "var(--radius)",
        md: "calc(var(--radius) + 2px)",
        lg: "calc(var(--radius) + 4px)",
        xl: "calc(var(--radius) + 8px)",
        "2xl": "calc(var(--radius) + 12px)",
      },
      boxShadow: {
        DEFAULT: "0px 4px 0px 6px rgba(0, 0, 0, 0.09)",
        sm: "0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)",
        tiny: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        buttons: "0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
      },
      zIndex: {
        tooltip: "110",
        sheet: "100",
        header: "50",
        footer: "50",
        drawer: "100",
        toast: "110",
        popover: "100",
        modal: "100",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      transitionDuration: {
        "1500": "1500ms",
        "2000": "2000ms",
      },
      transitionDelay: {
        "1500": "1500ms",
        "2000": "2000ms",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      maxHeight: {
        "folio-sheet": "calc(100% - 4.8125rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
