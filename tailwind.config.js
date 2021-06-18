module.exports = {
  mode: 'jit',
  purge: [
    './resources/**/*.html',
    './src/**/*.js'
  ],
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
