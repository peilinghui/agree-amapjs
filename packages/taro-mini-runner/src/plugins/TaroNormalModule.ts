import * as NormalModule from 'webpack/lib/NormalModule'
import { META_TYPE } from '@agreejs/helper'

export default class TaroNormalModule extends NormalModule {
  name: string
  miniType: META_TYPE
  constructor (data) {
    super(data)
    this.name = data.name
    this.miniType = data.miniType
  }
}
