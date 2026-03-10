/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        robin: {
          teal: '#0d2b3e',
          orange: '#e8622a',
          'orange-hover': '#d4561f',
          cyan: '#4ecdc4',
          blue: '#45b7d1',
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
