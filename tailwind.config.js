/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clay: "#B49A7A",
        sage: "#A8BDB4",
        sand: "#EDE6DB",
        moss: "#7A9E9F",
        terracotta: "#C97D60",
        ash: "#F5F3EF",
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
