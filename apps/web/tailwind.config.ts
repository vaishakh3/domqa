import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { border: "#e5e7eb", background: "#0b1020", foreground: "#e5eefc", accent: "#7c3aed" } } },
  plugins: [],
} satisfies Config;
