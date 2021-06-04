import { Alipay } from '@agreejs/plugin-platform-alipay'
import * as helper from '@agreejs/helper'
import { compile, getOutput } from './utils/compiler'

describe('alipay', () => {
  test('should build alipay app', async () => {
    const program = new Alipay({ helper } as any, {})

    const { stats, config } = await compile('react', {
      buildAdapter: 'alipay',
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
