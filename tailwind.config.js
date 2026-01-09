/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'], // <--- ADD THIS LINE
      },
      colors: {
        brand: {
          primary: '#FFC700',
          dark: '#111111', // Tweaked to match Sidebar darker tone
          accent: '#E63946',
        }
      }
    },
  },
  plugins: [],
}