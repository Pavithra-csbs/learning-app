/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#FFD700', // Gold
        'game-secondary': '#FF6B6B', // Red-Pink
        'game-success': '#4ECDC4', // Teal
        'game-dark': '#2C3E50',
        'game-bg': '#f7f1e3',
      },
      fontFamily: {
        'game': ['"Nunito"', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite",
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}

