/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#027148',  // Primary green
        'primary-warning': '#FDE68A', // Primary but warning (low on stock)
        'primary-error': '#FCA5A5', // Primary but error (no stock)
        'primary-focus': '#388e3c',  // A darker green for hover or focus
        'primary-content': '#ffffff',  // Text color on primary
        'secondary': '#B7E1B7',
        'secondary-content': '#ffffff',
        'tertiary': '#A3E4D7', // Tertiary color
        'light-grey': '#E0E0E0', // Light grey color
        'regular-text': '#000000',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#027148',  // Primary green
          'primary-warning': '#FDE68A', // Primary but warning (low on stock)
          'primary-error': '#FCA5A5', // Primary but error (no stock)
          'primary-focus': '#388e3c',  // A darker green for hover or focus
          'primary-content': '#ffffff',  // Text color on primary
          'secondary': '#B7E1B7',
          'secondary-content': '#ffffff',
          'tertiary': '#A3E4D7', // Tertiary color
          'light-grey': '#E0E0E0', // Light grey color
          'regular-text': '#000000',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
