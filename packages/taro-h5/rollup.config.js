import { mergeWith } from 'lodash'
import { join } from 'path'
import resolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'
import postcss from 'rollup-plugin-postcss'
import exportNameOnly from './build/rollup-plugin-export-name-only'

const babel = require('@rollup/plugin-babel').default

const cwd = __dirname
const baseConfig = {
  external: ['nervjs', '@agreejs/runtime', 'react-dom'],
  output: {
    format: 'cjs',
    sourcemap: false,
    exports: 'auto'
  },
  plugins: [
    alias({
      '@agreejs/taro': join(cwd, '../taro/src/index')
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['module', 'js-next', 'main']
    }),
    postcss(),
    babel({
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        ['@babel/plugin-transform-react-jsx', {
          pragma: 'Nerv.createElement'
        }]
      ]
    }),
    common()
  ]
}

const variesConfig = [{
  input: 'src/api/index.js',
  output: {
    file: 'dist/taroApis.js'
  },
  plugins: exportNameOnly()
}, {
  input: 'src/index.cjs.js',
  output: {
    file: 'dist/index.cjs.js'
  }
}]

export default variesConfig.map(v => {
  const customizer = function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
    if (typeof objValue === 'object') {
      return mergeWith({}, objValue, srcValue, customizer)
    }
  }
  return mergeWith({}, baseConfig, v, customizer)
})
