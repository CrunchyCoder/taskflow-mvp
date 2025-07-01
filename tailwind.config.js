/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Your custom earth tones
        ash: '#f5f5f4',
        sand: '#fef7ed',
        moss: '#16a34a',
        sage: '#84cc16',
        clay: '#a3a3a3',
        terracotta: '#ea580c'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}