/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5F00",
          light: "#FF7A29",
          dark: "#D45000",
        },
        neutral: {
          900: "#1A1A1A",
          800: "#333333",
          700: "#4D4D4D",
          600: "#666666",
          500: "#808080",
          400: "#999999",
          300: "#B3B3B3",
          200: "#CCCCCC",
          100: "#E6E6E6",
          50: "#F2F2F2",
        },
      },
    },
  },
  plugins: [],
};
