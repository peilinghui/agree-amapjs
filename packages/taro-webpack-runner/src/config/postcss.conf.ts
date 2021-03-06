import * as autoprefixer from 'autoprefixer'
import * as path from 'path'
import * as constparse from 'postcss-plugin-constparse'
import * as pxtransform from 'postcss-pxtransform'
import { sync as resolveSync } from 'resolve'
import { IPostcssOption, TogglableOptions } from '@agreejs/taro/types/compile'
import { recursiveMerge, isNpmPkg } from '@agreejs/helper'

const defaultAutoprefixerOption = {
  enable: true,
  config: {
    flexbox: 'no-2009'
  }
}
const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'h5'
  }
}
const defaultConstparseOption = {
  constants: [
    {
      key: 'taro-tabbar-height',
      val: '50PX'
    }
  ],
  platform: 'h5'
}

const optionsWithDefaults = ['autoprefixer', 'pxtransform', 'cssModules']

const plugins = [] as any[]

export const getPostcssPlugins = function (appPath: string, {
  designWidth,
  deviceRatio,
  postcssOption = {} as IPostcssOption
}) {
  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }

  const autoprefixerOption = recursiveMerge<TogglableOptions>({}, defaultAutoprefixerOption, postcssOption.autoprefixer)
  const pxtransformOption = recursiveMerge<TogglableOptions>({}, defaultPxtransformOption, postcssOption.pxtransform)

  if (autoprefixerOption.enable) {
    plugins.push(autoprefixer(autoprefixerOption.config))
  }

  if (pxtransformOption.enable) {
    plugins.push(pxtransform(pxtransformOption.config))
  }

  plugins.push(constparse(defaultConstparseOption))

  Object.entries(postcssOption).forEach(([pluginName, pluginOption]) => {
    if (optionsWithDefaults.indexOf(pluginName) > -1) return
    if (!pluginOption || !pluginOption.enable) return

    if (!isNpmPkg(pluginName)) {
      // local plugin
      pluginName = path.join(appPath, pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: appPath })
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `??????postcss??????${pluginName}, ?????????` : e
      console.log(msg)
    }
  })

  return plugins
}
