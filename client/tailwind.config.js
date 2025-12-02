const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ["14px", { lineHeight: "20px" }],
      sm: ["16px", { lineHeight: "24px" }],
      base: ["18px", { lineHeight: "28px" }],
      lg: ["20px", "30px"],
      xl: ["24px", "32px"],
      "2xl": ["30px", "38px"],
      "3xl": ["36px", "44px"],
    },
    extend: {
      colors: {
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        primary: {
          DEFAULT: "#047857",
          light: "#10B981",
          dark: "#064E3B",
          bg: "#ECFDF5",
        },
        action: {
          DEFAULT: "#1D4ED8",
          hover: "#1E40AF",
          bg: "#EFF6FF",
        },
        danger: {
          DEFAULT: "#DC2626",
          bg: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#D97706",
          bg: "#FFFBEB",
        },
      },
      spacing: {
        touch: "48px",
        safe: "16px",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
