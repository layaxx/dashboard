// tailwind.config.js
module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Lora", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        primary: "#493282",
        secondary: "var(--color-secondary)",
        error: "#b91c1c",
        warning: "#f97316",
        success: "#15803d",
      },
    },
  },
}
