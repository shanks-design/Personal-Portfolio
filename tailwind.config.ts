import type { Config } from "tailwindcss";
import grid, { gridSpacing } from "./lib/tailwind-grid";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: gridSpacing,
      lineHeight: gridSpacing,
      fontSize: {
        body: "var(--text-body)",
        display: "var(--text-display)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        "inter-variable": ["InterVariable", "sans-serif"],
        runde: ["OpenRunde", "sans-serif"],
        "haas-display": ["neue-haas-grotesk-display", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        "haas-text": ["neue-haas-grotesk-text", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "spin-slow": "spin 1.495s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [grid],
};
export default config;
