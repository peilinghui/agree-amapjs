import * as path from 'path'
import chalk from 'chalk'
import { run } from './utils'
import { getPkgVersion } from '../util'

jest.mock('envinfo', () => {
  const envinfo = jest.requireActual('envinfo')
  return {
    __esModule: true,
    async run (data, options) {
      const res = await envinfo.run(data, { ...options, json: true })
      return JSON.parse(res)
    }
  }
})

const runInfo = run('info')

describe('info', () => {
  it('should exit because there isn\'t a Taro project', async () => {
    const exitSpy = jest.spyOn(process, 'exit') as jest.SpyInstance<void, any>
    const logSpy = jest.spyOn(console, 'log')

    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})

    try {
      await runInfo('')
    } catch (error) {}

    expect(exitSpy).toBeCalledWith(1)
    expect(logSpy).toBeCalledWith(chalk.red('找不到项目配置文件config/index，请确定当前目录是 Taro 项目根目录!'))

    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should log infomations', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    const appPath = path.resolve(__dirname, 'fixtures/default')
    await runInfo(appPath)

    expect(logSpy).toBeCalledTimes(1)
    const res = logSpy.mock.calls[0][0]
    const title = `Taro CLI ${getPkgVersion()} environment info`
    expect(res.hasOwnProperty(title)).toBeTruthy()
    const info = res[title]
    expect('System' in info).toBeTruthy()
    expect('Binaries' in info).toBeTruthy()
    expect('npmPackages' in info).toBeTruthy()
    expect(Object.keys(info.System)).toEqual(['OS', 'Shell'])
    expect(Object.keys(info.Binaries)).toEqual(['Node', 'Yarn', 'npm'])
    expect(info.npmPackages.hasOwnProperty('@agreejs/helper')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@agreejs/mini-runner')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@agreejs/service')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@agreejs/taro')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@agreejs/taroize')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('@agreejs/webpack-runner')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('babel-plugin-transform-taroapi')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('eslint-config-taro')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('eslint-plugin-taro')).toBeTruthy()
    expect(info.npmPackages.hasOwnProperty('postcss-pxtransform')).toBeTruthy()

    logSpy.mockRestore()
  })
})
