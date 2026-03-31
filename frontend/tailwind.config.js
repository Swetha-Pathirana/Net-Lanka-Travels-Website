
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header-gradient': `linear-gradient(to bottom, #1a1a1a 10%, #2a2a2a 30%, rgba(42,42,42,0.3) 95%, rgba(42,42,42,0) 100%)`,
      },
      fontFamily: {
        'serif-custom': ['"Playfair Display"', 'serif'],
        playfair: ['"Playfair Display"', "serif"],
        inter: ["Inter", "sans-serif"] // custom font
      },
    },
  },
  plugins: [
    // Remove '@tailwindcss/line-clamp' plugin (Tailwind v3.3+ includes it natively)
  ],
}
