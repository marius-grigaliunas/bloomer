import colors from "./constants/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}"  // Add this line
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          background: {
            primary: colors.background.primary,
            surface: colors.background.surface
          },
          primary: {
            medium: colors.primary.medium,
            deep:  colors.primary.deep
          },
          secondary: {
            medium: colors.secondary.medium,
            deep: colors.secondary.deep
          },
          accent: colors.accent,
          success: colors.success,
          warning: colors.warning,
          danger: colors.danger,
          info: colors.info,
          text: {
            primary: colors.text.primary,
            secondary: colors.text.secondary
          }
        }
      }
    },
    plugins: [],
  }