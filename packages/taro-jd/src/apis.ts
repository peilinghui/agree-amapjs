import { processApis } from '@agreejs/shared'

declare const jd: any

export function initNativeApi (taro) {
  processApis(taro, jd)
}
