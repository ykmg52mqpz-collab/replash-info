import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0A0A0A",
          800: "#131313",
          700: "#1a1709",
          600: "#241f0d",
        },
        accent: {
          DEFAULT: "#FDE68A",
          neon: "#FEF3C7",
          glow: "rgba(253, 230, 138, 0.35)",
        },
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(253,230,138,0.16), transparent 60%), linear-gradient(180deg, #0A0A0A 0%, #1a1709 100%)",
        "section-gradient":
          "linear-gradient(180deg, #0A0A0A 0%, #161208 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(253, 230, 138, 0.35)",
        "glow-sm": "0 0 20px rgba(253, 230, 138, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
