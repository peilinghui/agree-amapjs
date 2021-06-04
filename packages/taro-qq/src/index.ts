import QQ from './program'
import type { IPluginContext } from '@agreejs/service'

export { QQ }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'qq',
    useConfigName: 'mini',
    async fn ({ config }) {
      const program = new QQ(ctx, config)
      await program.start()
    }
  })
}
