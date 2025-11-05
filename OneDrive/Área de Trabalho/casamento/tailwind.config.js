/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cursive': ['Great Vibes', 'cursive'],
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        'wedding-pink': '#F8E8E8',
        'wedding-rose': '#E8B4B8',
        'wedding-beige': '#F5F1E8',
        'wedding-gray': '#4A4A4A',
        'wedding-gold': '#D4AF37',
        'wedding-gold-light': '#E8D9A0',
        'wedding-gold-dark': '#B8941F',
        'off-white': '#FAFAFA',
      },
    },
  },
  plugins: [],
}

