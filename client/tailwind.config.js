/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0%', transform: 'translateY(100%)' },
          '100%': { opacity: '100%', transform: 'translateY(0)' },
        },

        slideIn: {
          '0%': { opacity: '0%', transform: 'translateX(-100%)' },
          '100%': { opacity: '100%', transform: 'translateX(0)' },
        },
      },

      animation: {
        fadeIn: 'fadeIn 1s ease-in-out 1 forwards',
        slideIn: 'slideIn .6s ease-in-out 1 forwards',
      },
    },
  },
  safelist: [
    {
      pattern:
        /(bg|text|shadow|border)-(green|blue|red)-(400|500|600|700|800|900|950)$/,
      variants: ['hover'],
    },
  ],
  plugins: [],
};
