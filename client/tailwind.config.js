/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'typing': 'typing 3s steps(40, end) infinite, blink-caret .75s step-end infinite',
      },
      keyframes: {
        typing: {
          '0%': { width: '0' },
          '70%': { width: '60%' },
          '90%': { width: '60%' },
          '100%': { width: '0' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'orange' },
        },
      },
    },
  },
  plugins: [],
}


