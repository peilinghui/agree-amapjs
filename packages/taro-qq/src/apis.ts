import { processApis } from '@agreejs/shared'
import {
  noPromiseApis,
  needPromiseApis
} from '@agreejs/plugin-platform-weapp/dist/runtime-utils'

declare const qq: any

const syncApis = new Set([
  'createAppBox'
])

const asyncApis = new Set([
  'getQQRunData',
  'requestWxPayment',
  'setAvatar',
  'shareInvite',
  'updateBookshelfReadTime'
])

export function initNativeApi (taro) {
  processApis(taro, qq, {
    noPromiseApis: new Set([...noPromiseApis, ...syncApis]),
    needPromiseApis: new Set([...needPromiseApis, ...asyncApis])
  })
  taro.cloud = qq.cloud
}
