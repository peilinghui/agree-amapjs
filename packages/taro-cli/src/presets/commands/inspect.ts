import * as path from 'path'
import { IPluginContext } from '@agreejs/service'
import {
  SOURCE_DIR,
  OUTPUT_DIR,
  ENTRY,
  resolveScriptPath
} from '@agreejs/helper'
import highlight from 'cli-highlight'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'inspect',
    optionsMap: {
      '-t, --type [typeName]': 'Build type, weapp/swan/alipay/tt/h5/quickapp/rn/qq/jd',
      '-o, --output [outputPath]': 'output config to ouputPath'
    },
    synopsisList: [
      'taro inspect --type weapp',
      'taro inspect --type weapp --output inspect.config.js',
      'taro inspect --type weapp plugins',
      'taro inspect --type weapp module.rules.0'
    ],
    async fn ({ _, options }) {
      const { fs, chalk } = ctx.helper
      const platform = options.type || options.t

      verifyIsTaroProject(ctx)
      verifyPlatform(platform, chalk)

      process.env.TARO_ENV = platform

      let config = getConfig(ctx, platform)
      const isProduction = process.env.NODE_ENV === 'production'
      const outputPath = options.output || options.o
      const mode = outputPath ? 'output' : 'console'
      const extractPath = _[1]

      config = {
        ...config,
        ...config[ctx.platforms.get(platform)?.useConfigName || '']
      }
      delete config.mini
      delete config.h5

      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            isWatch: !isProduction,
            mode: isProduction ? 'production' : 'development',
            async modifyWebpackChain (chain, webpack) {
              await ctx.applyPlugins({
                name: 'modifyWebpackChain',
                initialVal: chain,
                opts: {
                  chain,
                  webpack
                }
              })
            },
            onWebpackChainReady (chain) {
              const webpackConfig = chain.toConfig()
              const { toString } = chain.constructor
              const config = extractConfig(webpackConfig, extractPath)
              const res = toString(config)

              if (mode === 'console') {
                console.log(highlight(res, { language: 'js' }))
              } else if (mode === 'output' && outputPath) {
                fs.writeFileSync(outputPath, res)
              }

              process.exit(0)
            }
          }
        }
      })
    }
  })
}

/** ?????? Taro ??????????????? */
function verifyIsTaroProject (ctx: IPluginContext) {
  const { fs, chalk, PROJECT_CONFIG } = ctx.helper
  const { configPath } = ctx.paths

  if (!configPath || !fs.existsSync(configPath)) {
    console.log(chalk.red(`???????????????????????????${PROJECT_CONFIG}??????????????????????????? Taro ???????????????!`))
    process.exit(1)
  }
}

/** ?????????????????? */
function verifyPlatform (platform, chalk) {
  if (typeof platform !== 'string') {
    console.log(chalk.red('?????????????????????????????????'))
    process.exit(0)
  }
}

/** ?????? config */
function getConfig (ctx: IPluginContext, platform: string) {
  const { initialConfig } = ctx
  const sourceDirName = initialConfig.sourceRoot || SOURCE_DIR
  const outputDirName = initialConfig.outputRoot || OUTPUT_DIR
  const sourceDir = path.join(ctx.appPath, sourceDirName)
  const entryFilePath = resolveScriptPath(path.join(sourceDir, ENTRY))

  const entry = {
    [ENTRY]: [entryFilePath]
  }

  return {
    ...initialConfig,
    entry,
    sourceRoot: sourceDirName,
    outputRoot: outputDirName,
    platform
  }
}

/** ??????????????? webpackConfig ??????????????? */
function extractConfig (webpackConfig, extractPath: string | undefined) {
  if (!extractPath) return webpackConfig

  const list = extractPath.split('.')
  return list.reduce((config, current) => config[current], webpackConfig)
}
