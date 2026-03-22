import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-dm-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        // Semantic tokens backed by CSS variables
        background: "var(--bg-page)",
        foreground: "var(--text-primary)",
        border:     "var(--border-color)",
        muted: {
          DEFAULT:    "var(--bg-surface)",
          foreground: "var(--text-muted)",
        },
        brand: {
          DEFAULT: "#FF385C",
          hover:   "#E31C5F",
          light:   "rgba(255,56,92,0.08)",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light:   "#E8D5A0",
          dark:    "#8A6B28",
          50:  "#FAF6EB",
          100: "#F2E8C8",
          200: "#E8D5A0",
          300: "#DDC077",
          400: "#D4A94E",
          500: "#C9A84C",
          600: "#A8852A",
          700: "#8A6B28",
          800: "#6B511E",
          900: "#4D3914",
        },
        // Dark palette for backward-compat (overridden in light mode via CSS)
        dark: {
          DEFAULT:  "#121212",
          2:        "#1A1A1A",
          3:        "#252525",
          card:     "#1E1E1E",
          surface:  "#2A2A2A",
          surface2: "#333333",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        card:  "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
        hover: "0 6px 20px rgba(0,0,0,0.14)",
        gold:  "0 4px 16px rgba(201,168,76,0.20)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        shimmer:   "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
