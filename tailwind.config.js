// tailwind.config.js
module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Lora", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
      },
    },
  },
}
