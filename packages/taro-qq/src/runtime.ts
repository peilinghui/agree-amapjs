import { mergeReconciler, mergeInternalComponents } from '@agreejs/shared'
import { components as wxComponents } from '@agreejs/plugin-platform-weapp/dist/runtime-utils'
import { initNativeApi } from './apis'
import { components } from './components'

export const hostConfig = {
  initNativeApi
}

mergeReconciler(hostConfig)
mergeInternalComponents(wxComponents)
mergeInternalComponents(components)
