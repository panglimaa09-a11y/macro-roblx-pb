import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 40px rgba(0,240,255,.14)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-8px,0)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: ".55" },
          "50%": { opacity: "1" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        rise: "rise .7s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;