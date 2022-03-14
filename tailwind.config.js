const withAnimations = require('animated-tailwindcss');
module.exports = withAnimations({
  content: ["./src/**/*.{html,js}"],
  theme: {

    fontFamily: {
      'Raleway': ['"Raleway"', 'sans-serif'],
    },

    extend: {

    },

  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
});
