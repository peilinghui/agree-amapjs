import * as path from 'path'
import { run } from './utils'
import { getPkgVersion } from '../util'
import { exec } from 'child_process'
import {
  chalk,
  fs,
  shouldUseCnpm,
  shouldUseYarn,
  PROJECT_CONFIG
} from '@agreejs/helper'

const runUpdate = run('update')
const lastestVersion = getPkgVersion()

jest.mock('child_process', () => {
  const exec = jest.fn()
  exec.mockReturnValue({
    stdout: {
      on () {}
    },
    stderr: {
      on () {}
    }
  })
  return {
    __esModule: true,
    exec
  }
})

jest.mock('ora', () => {
  const ora = jest.fn()
  ora.mockReturnValue({
    start () {}
  })
  return ora
})

jest.mock('@agreejs/helper', () => {
  const helper = jest.requireActual('@agreejs/helper')
  const fs = jest.requireActual('fs-extra')
  return {
    __esModule: true,
    ...helper,
    shouldUseCnpm: jest.fn(),
    shouldUseYarn: jest.fn(),
    chalk: {
      red: jest.fn(),
      green () {}
    },
    fs: {
      ...fs,
      writeJson: jest.fn()
    }
  }
})

jest.mock('latest-version', () => () => lastestVersion)

function updatePkg (pkgPath: string, version: string) {
  let packageMap = require(pkgPath)
  packageMap = {
    ...packageMap,
    dependencies: {
      ...packageMap.dependencies,
      '@agreejs/shared': version,
      '@agreejs/taro': version,
      '@agreejs/cli': version,
      '@agreejs/components': version,
      '@agreejs/taro-h5': version,
      '@agreejs/helper': version,
      '@agreejs/taro-loader': version,
      '@agreejs/mini-runner': version,
      '@agreejs/react': version,
      '@agreejs/router': version,
      '@agreejs/runner-utils': version,
      '@agreejs/runtime': version,
      '@agreejs/service': version,
      '@agreejs/webpack-runner': version,
      '@agreejs/with-weapp': version,
      '@agreejs/taroize': version,
      '@agreejs/plugin-platform-weapp': version,
      '@agreejs/plugin-platform-alipay': version,
      '@agreejs/plugin-platform-swan': version,
      '@agreejs/plugin-platform-tt': version,
      '@agreejs/plugin-platform-jd': version,
      '@agreejs/plugin-platform-qq': version
    },
    devDependencies: {
      ...packageMap.devDependencies,
      'babel-preset-taro': version,
      'eslint-config-taro': version,
      'babel-plugin-transform-taroapi': version,
      'eslint-plugin-taro': version,
      'postcss-plugin-constparse': version,
      'postcss-pxtransform': version
    }
  }
  return packageMap
}

describe('update', () => {
  const execMocked = (exec as unknown) as jest.Mock<any>
  const shouldUseCnpmMocked = shouldUseCnpm as jest.Mock<any>
  const shouldUseYarnMocked = shouldUseYarn as jest.Mock<any>
  const writeJson = fs.writeJson as jest.Mock<any>

  beforeEach(() => {
    shouldUseCnpmMocked.mockReturnValue(false)
    shouldUseYarnMocked.mockReturnValue(false)
  })

  afterEach(() => {
    execMocked.mockClear()
    shouldUseCnpmMocked.mockReset()
    shouldUseYarnMocked.mockReset()
    writeJson.mockClear()
  })

  it('should log errors', async () => {
    const spy = jest.spyOn(console, 'log')
    spy.mockImplementation(() => {})
    await runUpdate('')
    expect(spy).toBeCalledTimes(3)
    spy.mockRestore()
  })

  it('should update self', async () => {
    await runUpdate('', {
      args: ['self']
    })
    expect(execMocked).toBeCalledWith(`npm i -g @agreejs/cli@${lastestVersion}`)
  })

  it('should update self using cnpm', async () => {
    shouldUseCnpmMocked.mockReturnValue(true)
    await runUpdate('', {
      args: ['self']
    })
    expect(execMocked).toBeCalledWith(`cnpm i -g @agreejs/cli@${lastestVersion}`)
  })

  it('should update self to specific version', async () => {
    const version = '3.0.0-beta.0'
    await runUpdate('', {
      args: ['self', version]
    })
    expect(execMocked).toBeCalledWith(`npm i -g @agreejs/cli@${version}`)
  })

  it('should throw when there isn\'t a Taro project', async () => {
    const chalkMocked = (chalk.red as unknown) as jest.Mock<any>
    const exitSpy = jest.spyOn(process, 'exit')
    const logSpy = jest.spyOn(console, 'log')
    exitSpy.mockImplementation(() => {
      throw new Error()
    })
    logSpy.mockImplementation(() => {})
    try {
      await runUpdate('', {
        args: ['project']
      })
    } catch (error) {}
    expect(exitSpy).toBeCalledWith(1)
    expect(chalkMocked).toBeCalledWith(`???????????????????????????${PROJECT_CONFIG}???????????????????????????Taro???????????????!`)
    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  it('should update project', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')
    const pkgPath = path.join(appPath, 'package.json')
    const packageMap = updatePkg(pkgPath, lastestVersion)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runUpdate(appPath, {
      args: ['project']
    })
    expect(writeJson.mock.calls[0][0]).toEqual(pkgPath)
    expect(writeJson.mock.calls[0][1]).toEqual(packageMap)
    expect(execMocked).toBeCalledWith('npm install')

    logSpy.mockRestore()
  })

  it('should update project to specific version', async () => {
    const version = '3.0.0-beta.4'
    const appPath = path.resolve(__dirname, 'fixtures/default')
    const pkgPath = path.join(appPath, 'package.json')
    const packageMap = updatePkg(pkgPath, version)

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    await runUpdate(appPath, {
      args: ['project', version]
    })
    expect(writeJson.mock.calls[0][0]).toEqual(pkgPath)
    expect(writeJson.mock.calls[0][1]).toEqual(packageMap)
    expect(execMocked).toBeCalledWith('npm install')

    logSpy.mockRestore()
  })

  it('should update project with yarn', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    shouldUseYarnMocked.mockReturnValue(true)

    await runUpdate(appPath, {
      args: ['project']
    })
    expect(execMocked).toBeCalledWith('yarn')

    logSpy.mockRestore()
  })

  it('should update project with cnpm', async () => {
    const appPath = path.resolve(__dirname, 'fixtures/default')

    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})
    shouldUseCnpmMocked.mockReturnValue(true)

    await runUpdate(appPath, {
      args: ['project']
    })
    expect(execMocked).toBeCalledWith('cnpm install')

    logSpy.mockRestore()
  })
})
