module.exports = {
  purge: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
   theme: {
     extend: {
      colors: {
        pink: '#e6007a',
        cyan: '#00ffe1',
        grey: '#2d2d2d'
      }
     }
   },
   variants: {
     extend: {}
   },
   plugins: [
    require('@tailwindcss/forms')
  ]
 }