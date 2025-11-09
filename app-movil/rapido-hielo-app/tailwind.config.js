import { Colors } from "./src/constants/Colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: Colors.primary,
        "primary-soft": Colors.primarySoft,
        "text-primary": Colors.textPrimary,
        "text-secondary": Colors.textSecondary,
        "badge-gray": Colors.badgeGray,
      },
      fontFamily: {
        regular: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        "semibold": ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
