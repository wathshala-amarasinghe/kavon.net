import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#DF0715",
          background: "#050505",
          card: "#0B0B0B",
          textPrimary: "#F7F7F7",
          textSecondary: "#BDBDBD",
          border: "#292929",
          // Legacy aliases
          volt: "#DF0715",
          black: "#050505",
          surface: "#0B0B0B",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
