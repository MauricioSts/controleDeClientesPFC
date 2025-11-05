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
        'montserrat': ['Montserrat', 'sans-serif'],
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
        'soft-gray': '#E8E8E8',
        'soft-pink': '#F5AEB4',
        'beige-rose': '#D6B6A1',
        'rose-soft': '#E6A6AD',
      },
    },
  },
  plugins: [],
}

