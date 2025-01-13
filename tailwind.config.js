/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    // colors: {
    //   'green': '#003018',
    //   'yellow': '#AA2C06',
    //   'whitish': '#D9D9D9',
    //   'pale-green': '#a1b7ac',
    //   'gray': '#9B9393',
    //   'white': '#FFFFFF',
    //   'link-color': '#0A81EE',
    //   'red':'#F11010'
    // },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}