/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a3ff',
          500: '#5c7aff',
          600: '#3d52f5',
          700: '#2e3dd9',
          800: '#2733b0',
          900: '#242e8c',
          950: '#151b54',
        },
      },
    },
  },
  plugins: [],
}
