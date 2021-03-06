import { processApis } from '@agreejs/shared'
import { noPromiseApis, needPromiseApis } from './apis-list'

declare const tt: any

export function initNativeApi (taro) {
  processApis(taro, tt, {
    noPromiseApis,
    needPromiseApis
  })
}
