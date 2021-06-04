import { mergeReconciler, mergeInternalComponents } from '@agreejs/shared'
import { hostConfig, components } from './runtime-utils'

mergeReconciler(hostConfig)
mergeInternalComponents(components)
