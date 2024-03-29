import alias from '@rollup/plugin-alias'
import autoprefixer from 'autoprefixer'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import progress from 'rollup-plugin-progress'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import tailwindcss from 'tailwindcss'
import terser from '@rollup/plugin-terser'
import AtImport from 'postcss-import'

const indexTemplate = 'resources/template.html'

// Add html template to watched files
function watchTemplates(files) {
  return {
    name: 'watch-template',
    async buildStart() {
      files.forEach((f) => this.addWatchFile(f))
    }
  }
}

let NODE_ENV = 'development'
let wantSourceMap = 'inline'
let wantMinimize = false

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  NODE_ENV = 'production'
  wantSourceMap = false
  wantMinimize = true
}

const config = {
  input: 'src/index.js',
  output: {
    file: 'public/index.js',
    format: 'umd',
    name: 'index',
    sourcemap: wantSourceMap
  },
  watch: {
    buildDelay: 100,
    chokidar: {
      usePolling: true
    }
  },
  plugins: [
    watchTemplates([indexTemplate]),
    progress(),
    resolve({
      browser: true
    }),
    alias({
      resolve: ['.js', '.css']
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: wantMinimize,
      sourceMap: wantSourceMap,
      plugins: [AtImport(), tailwindcss, autoprefixer]
    }),
    htmlTemplate({
      template: indexTemplate,
      target: 'public/index.html',
      attrs: ['defer']
    })
  ]
}

if (NODE_ENV === 'production') {
  config.plugins.push(terser())
}

if (process.env.SERVE === 'yes') {
  config.plugins.push(
    serve({
      contentBase: 'public'
    })
  )
  config.plugins.push(
    livereload({
      watch: 'public'
    })
  )
}

export default config
