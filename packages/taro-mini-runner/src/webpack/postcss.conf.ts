import * as path from 'path'

import * as autoprefixer from 'autoprefixer'
import * as pxtransform from 'postcss-pxtransform'
import { sync as resolveSync } from 'resolve'
import * as url from 'postcss-url'
import { IPostcssOption } from '@agreejs/taro/types/compile'
import { isNpmPkg, recursiveMerge } from '@agreejs/helper'

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
    platform: 'weapp'
  }
}

const defaultUrlOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    limit: 1000,
    url: 'inline'
  }
}

const optionsWithDefaults = ['autoprefixer', 'pxtransform', 'cssModules', 'url']

const plugins = [] as any[]

export const getPostcssPlugins = function (appPath: string, {
  isBuildQuickapp = false,
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

  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, postcssOption.autoprefixer)
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, postcssOption.pxtransform)
  const urlOption = recursiveMerge({}, defaultUrlOption, postcssOption.url)
  if (autoprefixerOption.enable) {
    plugins.push(autoprefixer(autoprefixerOption.config))
  }

  if (pxtransformOption.enable && !isBuildQuickapp) {
    plugins.push(pxtransform(pxtransformOption.config))
  }
  if (urlOption.enable) {
    plugins.push(url(urlOption.config))
  }
  plugins.unshift(require('postcss-import'))
  Object.entries(postcssOption).forEach(([pluginName, pluginOption]) => {
    if (optionsWithDefaults.indexOf(pluginName) > -1) return
    if (!pluginOption || !pluginOption.enable) return

    if (!isNpmPkg(pluginName)) { // local plugin
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
