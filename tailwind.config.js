/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "slide-down": {
          "0%": { opacity: "1", transform: "translateY(-0.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-down": "slide-down 250ms ease-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
