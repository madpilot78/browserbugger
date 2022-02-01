module.exports = {
  content: [
    './resources/**/*.html',
    './src/**/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
