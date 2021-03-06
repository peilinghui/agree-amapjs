/* eslint-disable dot-notation */
import { isFunction, EMPTY_OBJ, ensure, Shortcuts, isUndefined, isArray, warn } from '@agreejs/shared'
import { eventHandler } from '../dom/event'
import { Current } from '../current'
import { document } from '../bom/document'
import { TaroRootElement } from '../dom/root'
import { MpInstance } from '../hydrate'
import { Instance, PageInstance, PageProps } from './instance'
import { incrementId } from '../utils'
import { perf } from '../perf'
import { PAGE_INIT } from '../constants'
import { isBrowser } from '../env'
import { eventCenter } from '../emitter/emitter'
import { raf } from '../bom/raf'
import { CurrentReconciler } from '../reconciler'

import type { PageConfig } from '@agreejs/taro'
import type { Func } from '../utils/types'

const instances = new Map<string, Instance>()

export function injectPageInstance (inst: Instance<PageProps>, id: string) {
  CurrentReconciler.mergePageInstance?.(instances.get(id), inst)
  instances.set(id, inst)
}

export function getPageInstance (id: string) {
  return instances.get(id)
}

export function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

const pageId = incrementId()

export function safeExecute (path: string, lifecycle: keyof PageInstance, ...args: unknown[]) {
  const instance = instances.get(path)

  if (instance == null) {
    return
  }

  const func = CurrentReconciler.getLifecyle(instance, lifecycle)

  if (isArray(func)) {
    const res = func.map(fn => fn.apply(instance, args))
    return res[0]
  }

  if (!isFunction(func)) {
    return
  }

  return func.apply(instance, args)
}

export function stringify (obj?: Record<string, unknown>) {
  if (obj == null) {
    return ''
  }
  const path = Object.keys(obj).map((key) => {
    return key + '=' + obj[key]
  }).join('&')
  return path === '' ? path : '?' + path
}

export function getPath (id: string, options?: Record<string, unknown>): string {
  let path = id
  if (!isBrowser) {
    path = id + stringify(options)
  }
  return path
}

export function getOnReadyEventKey (path: string) {
  return path + '.' + 'onReady'
}

export function getOnShowEventKey (path: string) {
  return path + '.' + 'onShow'
}

export function getOnHideEventKey (path: string) {
  return path + '.' + 'onHide'
}

export function createPageConfig (component: any, pageName?: string, data?: Record<string, unknown>, pageConfig?: PageConfig) {
  const id = pageName ?? `taro_page_${pageId()}`
  // ????????? Page ??????????????????????????????????????????????????????????????????????????????
  let pageElement: TaroRootElement | null = null

  let unmounting = false
  let prepareMountList: (() => void)[] = []

  const config: PageInstance = {
    onLoad (this: MpInstance, options, cb?: Func) {
      perf.start(PAGE_INIT)

      Current.page = this as any
      this.config = pageConfig || {}
      if (this.options == null) {
        this.options = options
      }
      this.options.$taroTimestamp = Date.now()

      const path = getPath(id, this.options)
      const router = isBrowser ? path : this.route || this.__route__
      Current.router = {
        params: this.options,
        path: addLeadingSlash(router),
        onReady: getOnReadyEventKey(id),
        onShow: getOnShowEventKey(id),
        onHide: getOnHideEventKey(id)
      }

      const mount = () => {
        Current.app!.mount!(component, path, () => {
          pageElement = document.getElementById<TaroRootElement>(path)

          ensure(pageElement !== null, '???????????????????????????')
          safeExecute(path, 'onLoad', this.options)
          if (!isBrowser) {
            pageElement.ctx = this
            pageElement.performUpdate(true, cb)
          }
        })
      }
      if (unmounting) {
        prepareMountList.push(mount)
      } else {
        mount()
      }
    },
    onReady () {
      const path = getPath(id, this.options)

      raf(() => {
        eventCenter.trigger(getOnReadyEventKey(id))
      })

      safeExecute(path, 'onReady')
      this.onReady.called = true
    },
    onUnload () {
      const path = getPath(id, this.options)
      unmounting = true
      Current.app!.unmount!(path, () => {
        unmounting = false
        instances.delete(path)
        if (pageElement) {
          pageElement.ctx = null
        }
        if (prepareMountList.length) {
          prepareMountList.forEach(fn => fn())
          prepareMountList = []
        }
      })
    },
    onShow () {
      Current.page = this as any
      this.config = pageConfig || {}
      const path = getPath(id, this.options)
      const router = isBrowser ? path : this.route || this.__route__
      Current.router = {
        params: this.options,
        path: addLeadingSlash(router),
        onReady: getOnReadyEventKey(id),
        onShow: getOnShowEventKey(id),
        onHide: getOnHideEventKey(id)
      }

      raf(() => {
        eventCenter.trigger(getOnShowEventKey(id))
      })

      safeExecute(path, 'onShow')
    },
    onHide () {
      Current.page = null
      Current.router = null
      const path = getPath(id, this.options)
      safeExecute(path, 'onHide')
      eventCenter.trigger(getOnHideEventKey(id))
    },
    onPullDownRefresh () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPullDownRefresh')
    },
    onReachBottom () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onReachBottom')
    },
    onPageScroll (options) {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPageScroll', options)
    },
    onResize (options) {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onResize', options)
    },
    onTabItemTap (options) {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onTabItemTap', options)
    },
    onTitleClick () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onTitleClick')
    },
    onOptionMenuClick () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onOptionMenuClick')
    },
    onPopMenuClick () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPopMenuClick')
    },
    onPullIntercept () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onPullIntercept')
    },
    onAddToFavorites () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onAddToFavorites')
    }
  }

  // onShareAppMessage ??? onShareTimeline ?????????????????????????????????????????????????????????????????????????????????
  if (component.onShareAppMessage ||
      component.prototype?.onShareAppMessage ||
      component.enableShareAppMessage) {
    config.onShareAppMessage = function (options) {
      const target = options.target
      if (target != null) {
        const id = target.id
        const element = document.getElementById(id)
        if (element != null) {
          options.target!.dataset = element.dataset
        }
      }
      const path = getPath(id, this.options)
      return safeExecute(path, 'onShareAppMessage', options)
    }
  }
  if (component.onShareTimeline ||
      component.prototype?.onShareTimeline ||
      component.enableShareTimeline) {
    config.onShareTimeline = function () {
      const path = getPath(id, this.options)
      return safeExecute(path, 'onShareTimeline')
    }
  }

  config.eh = eventHandler

  if (!isUndefined(data)) {
    config.data = data
  }

  if (isBrowser) {
    config.path = id
  }

  return config
}

export function createComponentConfig (component: React.ComponentClass, componentName?: string, data?: Record<string, unknown>) {
  const id = componentName ?? `taro_component_${pageId()}`
  let componentElement: TaroRootElement | null = null

  const config: any = {
    attached () {
      perf.start(PAGE_INIT)
      const path = getPath(id, { id: this.getPageId() })
      Current.app!.mount!(component, path, () => {
        componentElement = document.getElementById<TaroRootElement>(path)
        ensure(componentElement !== null, '???????????????????????????')
        safeExecute(path, 'onLoad')
        if (!isBrowser) {
          componentElement.ctx = this
          componentElement.performUpdate(true)
        }
      })
    },
    detached () {
      const path = getPath(id, { id: this.getPageId() })
      Current.app!.unmount!(path, () => {
        instances.delete(path)
        if (componentElement) {
          componentElement.ctx = null
        }
      })
    },
    pageLifetimes: {
      show () {
        safeExecute(id, 'onShow')
      },
      hide () {
        safeExecute(id, 'onHide')
      }
    },
    methods: {
      eh: eventHandler
    }
  }
  if (!isUndefined(data)) {
    config.data = data
  }

  config['options'] = component?.['options'] ?? EMPTY_OBJ
  config['externalClasses'] = component?.['externalClasses'] ?? EMPTY_OBJ
  config['behaviors'] = component?.['behaviors'] ?? EMPTY_OBJ
  return config
}

export function createRecursiveComponentConfig (componentName?: string) {
  return {
    properties: {
      i: {
        type: Object,
        value: {
          [Shortcuts.NodeName]: 'view'
        }
      },
      l: {
        type: String,
        value: ''
      }
    },
    observers: {
      i (val: Record<string, unknown>) {
        warn(
          val[Shortcuts.NodeName] === '#text',
          `????????????????????????????????? Text ?????????<text>${val[Shortcuts.Text]}</text>????????????https://github.com/NervJS/taro/issues/6054`
        )
      }
    },
    options: {
      addGlobalClass: true,
      virtualHost: componentName !== 'custom-wrapper'
    },
    methods: {
      eh: eventHandler
    }
  }
}
