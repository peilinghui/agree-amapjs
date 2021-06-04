const { CurrentReconciler } = require('@agreejs/runtime')
const taro = require('@agreejs/api').default

if (typeof CurrentReconciler.initNativeApi === 'function') {
  CurrentReconciler.initNativeApi(taro)
}

module.exports = taro
module.exports.default = module.exports
