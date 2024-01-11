import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      extend: {
        fontFamily: {
          inter: ['Inter', ...defaultTheme.fontFamily.sans],
          gilroy: ['Gilroy', ...defaultTheme.fontFamily.sans]
        }
      },
      gridTemplateColumns: {
        'assets-table-row': '30% repeat(4, minmax(200px, 1fr))',
      }
    },
  },
  plugins: [],
}

