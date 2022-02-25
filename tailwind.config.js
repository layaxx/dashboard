function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

// tailwind.config.js
module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Peddana", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        primary: withOpacityValue("--color-primary"),
        secondary: withOpacityValue("--color-secondary"),
        // ...
      },
    },
  },
}
