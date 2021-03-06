import { unsupport, setUniqueKeyToRoute } from './utils'

declare const getCurrentPages: () => any
declare const getApp: () => any
declare const requirePlugin: () => void

type IObject = Record<string, any>

interface IProcessApisIOptions {
  noPromiseApis?: Set<string>
  needPromiseApis?: Set<string>
  handleSyncApis?: (key: string, global: IObject, args: any[]) => any
  transformMeta?: (key: string, options: IObject) => { key: string, options: IObject },
  modifyAsyncResult?: (key: string, res) => void
  isOnlyPromisify?: boolean
  [propName: string]: any
}

const noPromiseApis = new Set<string>([
  'clearStorageSync',
  'getBatteryInfoSync',
  'getExtConfigSync',
  'getFileSystemManager',
  'getLaunchOptionsSync',
  'getStorageInfoSync',
  'getStorageSync',
  'getSystemInfoSync',
  'offAccelerometerChange',
  'offAppHide',
  'offAppShow',
  'offAudioInterruptionBegin',
  'offAudioInterruptionEnd',
  'offBLECharacteristicValueChange',
  'offBLEConnectionStateChange',
  'offBluetoothAdapterStateChange',
  'offBluetoothDeviceFound',
  'offCompassChange',
  'offError',
  'offGetWifiList',
  'offGyroscopeChange',
  'offMemoryWarning',
  'offNetworkStatusChange',
  'offPageNotFound',
  'offUnhandledRejection',
  'offUserCaptureScreen',
  'onAccelerometerChange',
  'onAppHide',
  'onAppShow',
  'onAudioInterruptionBegin',
  'onAudioInterruptionEnd',
  'onBLECharacteristicValueChange',
  'onBLEConnectionStateChange',
  'onBeaconServiceChange',
  'onBeaconUpdate',
  'onBluetoothAdapterStateChange',
  'onBluetoothDeviceFound',
  'onCompassChange',
  'onDeviceMotionChange',
  'onError',
  'onGetWifiList',
  'onGyroscopeChange',
  'onMemoryWarning',
  'onNetworkStatusChange',
  'onPageNotFound',
  'onSocketClose',
  'onSocketError',
  'onSocketMessage',
  'onSocketOpen',
  'onUnhandledRejection',
  'onUserCaptureScreen',
  'removeStorageSync',
  'reportAnalytics',
  'setStorageSync',
  'arrayBufferToBase64',
  'base64ToArrayBuffer',
  'canIUse',
  'createAnimation',
  'createCameraContext',
  'createCanvasContext',
  'createInnerAudioContext',
  'createIntersectionObserver',
  'createInterstitialAd',
  'createLivePlayerContext',
  'createMapContext',
  'createSelectorQuery',
  'createVideoContext',
  'getBackgroundAudioManager',
  'getMenuButtonBoundingClientRect',
  'getRecorderManager',
  'getUpdateManager'
])

const needPromiseApis = new Set<string>([
  'addPhoneContact',
  'authorize',
  'canvasGetImageData',
  'canvasPutImageData',
  'canvasToTempFilePath',
  'checkSession',
  'chooseAddress',
  'chooseImage',
  'chooseInvoiceTitle',
  'chooseLocation',
  'chooseVideo',
  'clearStorage',
  'closeBLEConnection',
  'closeBluetoothAdapter',
  'closeSocket',
  'compressImage',
  'connectSocket',
  'createBLEConnection',
  'downloadFile',
  'getAvailableAudioSources',
  'getBLEDeviceCharacteristics',
  'getBLEDeviceServices',
  'getBatteryInfo',
  'getBeacons',
  'getBluetoothAdapterState',
  'getBluetoothDevices',
  'getClipboardData',
  'getConnectedBluetoothDevices',
  'getConnectedWifi',
  'getExtConfig',
  'getFileInfo',
  'getImageInfo',
  'getLocation',
  'getNetworkType',
  'getSavedFileInfo',
  'getSavedFileList',
  'getScreenBrightness',
  'getSetting',
  'getStorage',
  'getStorageInfo',
  'getSystemInfo',
  'getUserInfo',
  'getWifiList',
  'hideHomeButton',
  'hideShareMenu',
  'hideTabBar',
  'hideTabBarRedDot',
  'loadFontFace',
  'login',
  'makePhoneCall',
  'navigateBack',
  'navigateBackMiniProgram',
  'navigateTo',
  'navigateToBookshelf',
  'navigateToMiniProgram',
  'notifyBLECharacteristicValueChange',
  'hideKeyboard',
  'hideLoading',
  'hideNavigationBarLoading',
  'hideToast',
  'openBluetoothAdapter',
  'openDocument',
  'openLocation',
  'openSetting',
  'pageScrollTo',
  'previewImage',
  'queryBookshelf',
  'reLaunch',
  'readBLECharacteristicValue',
  'redirectTo',
  'removeSavedFile',
  'removeStorage',
  'removeTabBarBadge',
  'requestSubscribeMessage',
  'saveFile',
  'saveImageToPhotosAlbum',
  'saveVideoToPhotosAlbum',
  'scanCode',
  'sendSocketMessage',
  'setBackgroundColor',
  'setBackgroundTextStyle',
  'setClipboardData',
  'setEnableDebug',
  'setInnerAudioOption',
  'setKeepScreenOn',
  'setNavigationBarColor',
  'setNavigationBarTitle',
  'setScreenBrightness',
  'setStorage',
  'setTabBarBadge',
  'setTabBarItem',
  'setTabBarStyle',
  'showActionSheet',
  'showFavoriteGuide',
  'showLoading',
  'showModal',
  'showShareMenu',
  'showTabBar',
  'showTabBarRedDot',
  'showToast',
  'startBeaconDiscovery',
  'startBluetoothDevicesDiscovery',
  'startDeviceMotionListening',
  'startPullDownRefresh',
  'stopBeaconDiscovery',
  'stopBluetoothDevicesDiscovery',
  'stopCompass',
  'startCompass',
  'startAccelerometer',
  'stopAccelerometer',
  'showNavigationBarLoading',
  'stopDeviceMotionListening',
  'stopPullDownRefresh',
  'switchTab',
  'uploadFile',
  'vibrateLong',
  'vibrateShort',
  'writeBLECharacteristicValue'
])

function getCanIUseWebp (taro) {
  return function () {
    if (typeof taro.getSystemInfoSync !== 'function') {
      console.error('????????? API canIUseWebp')
      return false
    }
    const { platform } = taro.getSystemInfoSync()
    const platformLower = platform.toLowerCase()
    if (platformLower === 'android' || platformLower === 'devtools') {
      return true
    }
    return false
  }
}

function getNormalRequest (global) {
  return function request (options) {
    options = options || {}
    if (typeof options === 'string') {
      options = {
        url: options
      }
    }
    const originSuccess = options.success
    const originFail = options.fail
    const originComplete = options.complete
    let requestTask
    const p: any = new Promise((resolve, reject) => {
      options.success = res => {
        originSuccess && originSuccess(res)
        resolve(res)
      }
      options.fail = res => {
        originFail && originFail(res)
        reject(res)
      }

      options.complete = res => {
        originComplete && originComplete(res)
      }

      requestTask = global.request(options)
    })
    p.abort = (cb) => {
      cb && cb()
      if (requestTask) {
        requestTask.abort()
      }
      return p
    }
    return p
  }
}

function processApis (taro, global, config: IProcessApisIOptions = {}) {
  const patchNoPromiseApis = config.noPromiseApis || []
  const patchNeedPromiseApis = config.needPromiseApis || []
  const _noPromiseApis = new Set<string>([...patchNoPromiseApis, ...noPromiseApis])
  const _needPromiseApis = new Set<string>([...patchNeedPromiseApis, ...needPromiseApis])
  const apis = [..._noPromiseApis, ..._needPromiseApis]

  apis.forEach(key => {
    if (_needPromiseApis.has(key)) {
      const originKey = key
      taro[originKey] = (options: Record<string, any> | string = {}, ...args) => {
        let key = originKey

        // ??????????????? options ???????????????????????????
        if (typeof options === 'string') {
          if (args.length) {
            return global[key](options, ...args)
          }
          return global[key](options)
        }

        // ?????? key ??? option ????????????????????????????????????????????????????????????????????????
        if (config.transformMeta) {
          const transformResult = config.transformMeta(key, options)
          key = transformResult.key
          ;(options as Record<string, any>) = transformResult.options
          // ??? key ???????????????
          if (!global.hasOwnProperty(key)) {
            return unsupport(key)()
          }
        }

        let task: any = null
        const obj: Record<string, any> = Object.assign({}, options)

        // ???????????????????????? API ??????????????????????????????????????????????????? runtime ???????????????
        setUniqueKeyToRoute(key, options)

        // Promise ???
        const p: any = new Promise((resolve, reject) => {
          obj.success = res => {
            config.modifyAsyncResult?.(key, res)
            options.success?.(res)
            if (key === 'connectSocket') {
              resolve(
                Promise.resolve().then(() => Object.assign(task, res))
              )
            } else {
              resolve(res)
            }
          }
          obj.fail = res => {
            options.fail?.(res)
            reject(res)
          }
          obj.complete = res => {
            options.complete?.(res)
          }
          if (args.length) {
            task = global[key](obj, ...args)
          } else {
            task = global[key](obj)
          }
        })

        // ??? promise ??????????????????
        if (key === 'uploadFile' || key === 'downloadFile') {
          p.progress = cb => {
            task?.onProgressUpdate(cb)
            return p
          }
          p.abort = cb => {
            cb?.()
            task?.abort()
            return p
          }
        }
        return p
      }
    } else {
      // API ?????????
      if (!global.hasOwnProperty(key)) {
        taro[key] = unsupport(key)
        return
      }
      taro[key] = (...args) => {
        if (config.handleSyncApis) {
          return config.handleSyncApis(key, global, args)
        } else {
          return global[key].apply(global, args)
        }
      }
    }
  })

  !config.isOnlyPromisify && equipCommonApis(taro, global, config)
}

/**
 * ???????????? API
 * @param taro Taro ??????
 * @param global ???????????????????????????????????? wx??????????????? my
 */
function equipCommonApis (taro, global, apis: Record<string, any> = {}) {
  taro.canIUseWebp = getCanIUseWebp(taro)
  taro.getCurrentPages = getCurrentPages || unsupport('getCurrentPages')
  taro.getApp = getApp || unsupport('getApp')
  taro.env = global.env || {}

  try {
    taro.requirePlugin = requirePlugin || unsupport('requirePlugin')
  } catch (error) {
    taro.requirePlugin = unsupport('requirePlugin')
  }

  // request & interceptors
  const request = apis.request ? apis.request : getNormalRequest(global)
  function taroInterceptor (chain) {
    return request(chain.requestParams)
  }
  const link = new taro.Link(taroInterceptor)
  taro.request = link.request.bind(link)
  taro.addInterceptor = link.addInterceptor.bind(link)
  taro.cleanInterceptors = link.cleanInterceptors.bind(link)
  taro.miniGlobal = global
}

export {
  processApis
}
