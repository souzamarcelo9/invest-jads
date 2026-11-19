import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0E3B43", soft: "#2C5A62", mute: "#5E7C81" },
        paper: { DEFAULT: "#F2F5F2", deep: "#E4EBE6" },
        ouro: { DEFAULT: "#D9A21B", soft: "#F6E7BE", deep: "#9C7210" },
        folha: { DEFAULT: "#2F8F6B", soft: "#D5EEE3" },
        alerta: { DEFAULT: "#B83A4B", soft: "#F6DDE0" },
        conservador: "#3E7CB1",
        moderado: "#2F8F6B",
        arrojado: "#C9731E",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Source Sans 3"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: { panel: "22px" },
    },
  },
  plugins: [],
};
export default config;
