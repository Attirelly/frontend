module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#F59E0B',
        skeleton: {
          DEFAULT: '#0f172a',
          base: '#e0e0e0',
          highlight: '#f5f5f5',
        },
      },
      fontFamily:{
        sans: ['var(--font-manrope)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwind-scrollbar-hide'),
  ],
}
