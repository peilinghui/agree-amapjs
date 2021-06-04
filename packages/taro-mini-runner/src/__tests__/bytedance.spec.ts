import { TT } from '@agreejs/plugin-platform-tt'
import * as helper from '@agreejs/helper'
import { compile, getOutput } from './utils/compiler'

describe('bytedance', () => {
  test('should build bytedance app', async () => {
    const program = new TT({ helper } as any, {})

    const { stats, config } = await compile('react', {
      buildAdapter: 'tt',
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
