let purge = []

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  purge = [
    './resources/**/*.html',
    './src/**/*.js'
  ]
}

module.exports = {
  purge: purge,
  darkMode: 'media',
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
