import {
  isString,
  effectT
} from '../libs/mobius-utils'

/**
 * @param interval Number, Optional (in ms), default to 100
 * @return tache Tache
 */
export const idToNodeT = (interval = 100) => {
  return effectT((() => {
    const _internalValues = { container: undefined, timer: 0 }
    return (emit, selector) => {
      if (!isString(selector)) {
        throw (new TypeError('"selector" pass to idToNodeT tache is expected to be type of "String".'))
      }
      _internalValues.timer = setInterval(() => {
        if (selector.includes('#') || selector.includes('.')) {
          _internalValues.container = _internalValues.container || document.querySelector(selector)
        } else {
          _internalValues.container = _internalValues.container || document.getElementById(selector)
        }
        if (_internalValues.container) {
          clearInterval(_internalValues.timer)
          emit(_internalValues.container)
        }
      }, interval)
    }
  })())
}
