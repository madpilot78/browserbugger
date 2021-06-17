import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import progress from 'rollup-plugin-progress'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser'

const indexTemplate = 'resources/template.html'

// Add html template to watched files
function watchTemplates (files) {
  return {
    name: 'watch-template',
    async buildStart () {
      files.forEach(f => this.addWatchFile(f))
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
    builtins(),
    resolve({
      browser: true
    }),
    alias({
      resolve: ['.js', '.css'],
      entries: [
        {
          find: /(.*)\.css/,
          replacement: 'resources/css/$1.css'
        }
      ]
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
      plugins: [
        tailwindcss,
        autoprefixer
      ]
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
