import colors from "./constants/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          // Main background colors (dark theme)
          background: {
            DEFAULT: colors.background.DEFAULT, // Very dark green for main background
            lighter: colors.background.lighter, // Slightly lighter dark green for cards/containers
            elevated: colors.background.elevated  // Elevated surfaces
          },
          
          // Primary green colors
          primary: {
            DEFAULT: colors.primary.DEFAULT, // Main green color
            light: colors.primary.light,   // Lighter green
            dark: colors.primary.dark,    // Darker green
            muted: colors.primary.muted    // Muted variant
          },
          
          // Secondary accent color (earthy tone)
          earth: {
            DEFAULT: colors.earth.DEFAULT, // Earthy brown
            light: colors.earth.light,   // Lighter brown
            dark: colors.earth.dark,    // Darker brown
            muted: colors.earth.muted    // Very dark brown
          },
          
          // Accent colors
          accent: {
            moss: colors.accent.moss,    // Moss green
            leaf: colors.accent.leaf,    // Leaf green
            mint: colors.accent.mint,    // Mint green
            olive: colors.accent.olive,   // Olive green
            soil: colors.accent.soil     // Soil brown
          },
          
          // Functional colors
          success: colors.success,   // Success green
          warning: colors.warning,   // Warning yellow
          danger: colors.danger,    // Error/danger red
          info: colors.info,      // Info blue
          
          // Text colors
          text: {
            primary: colors.text.primary,    // Primary text on dark
            secondary: colors.text.secondary,  // Secondary text
            disabled: colors.text.disabled,   // Disabled text
            inverse: colors.text.inverse     // Text on light backgrounds
          },
          
          // Border and divider
          border: {
            DEFAULT: colors.border.DEFAULT,    // Default borders
            light: colors.border.light,      // Lighter borders
            focus: colors.border.focus       // Focus borders
          }
        }
      },
    },
    plugins: [],
  }