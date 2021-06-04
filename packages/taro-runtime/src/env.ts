import { EMPTY_OBJ } from '@agreejs/shared'

export const isBrowser = typeof document !== 'undefined' && !!document.scripts
export const doc: Document = isBrowser ? document : EMPTY_OBJ
export const win: Window = isBrowser ? window : EMPTY_OBJ
