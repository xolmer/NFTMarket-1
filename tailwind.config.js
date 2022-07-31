/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"],
  theme: {
    theme: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        gray: colors.coolGray,
        blue: colors.lightBlue,
        red: colors.rose,
        pink: colors.fuchsia,
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      extend: {
        spacing: {
          128: "32rem",
          144: "36rem",
        },
        borderRadius: {
          "4xl": "2rem",
        },
      },
    },
  },
  // enable dark mode via class strategy
  darkMode: "class",
  plugins: [require("flowbite/plugin")],

  // make sure to safelist these classes when using purge
  safelist: ["w-64", "w-1/2", "rounded-l-lg", "rounded-r-lg", "bg-gray-200", "grid-cols-4", "grid-cols-7", "h-6", "leading-6", "h-9", "leading-9", "shadow-lg"],
};
