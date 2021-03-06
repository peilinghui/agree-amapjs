import { TaroPlatformBase } from '@agreejs/service'
import { Template } from './template'
import { components } from './components'

const PACKAGE_NAME = '@agreejs/plugin-platform-swan'
const PROJECT_JSON = 'project.swan.json'

export default class Swan extends TaroPlatformBase {
  platform = 'swan'
  globalObject = 'swan'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`
  taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`
  fileType = {
    templ: '.swan',
    style: '.css',
    config: '.json',
    script: '.js',
    xs: '.sjs'
  }

  template = new Template()

  /**
   * 1. setupTransaction - init
   * 2. setup
   * 3. setupTransaction - close
   * 4. buildTransaction - init
   * 5. build
   * 6. buildTransaction - close
   */
  constructor (ctx, config) {
    super(ctx, config)

    this.setupTransaction.addWrapper({
      close () {
        this.modifyComponents()
        ctx.generateFrameworkInfo()
        this.generateProjectConfig(PROJECT_JSON, PROJECT_JSON)
      }
    })
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    this.template.mergeComponents(this.ctx, components)
  }
}
