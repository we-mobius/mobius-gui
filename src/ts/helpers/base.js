import { isString, isObject, isFunction } from '../libs/mobius-utils.js'

export const DIRTY = {}
export const dirty = value => ({ value: value, dirty: DIRTY })
export const isDirty = tar => isObject(tar) && tar.dirty === DIRTY

const isQuoted = tar => {
  if (tar.length < 3) {
    return false
  }
  const s = tar[0] + tar[tar.length - 1]
  return s === '""' || s === "''" || tar[0] + s === '``'
}
const removeQuote = str => str.slice(1, str.length - 1)

export const isMarker = tar => (isString(tar) && isQuoted(tar)) || (isObject(tar) && tar.isMarker)
export class Marker {
  constructor (value) {
    if (isObject(value) && value.isMarker) {
      return value
    }
    if (isFunction(value)) {
      value = value()
    }
    if (!isString(value) || value.length === 0) {
      throw (new TypeError('"value" of Marker is expected to be a unempty string!'))
    }
    if (isQuoted(value)) {
      value = removeQuote(value)
    }
    this._value = value
  }

  get isMarker () {
    return true
  }

  get value () {
    return this._value
  }

  static of (value) {
    return new Marker(value)
  }
}

export const isPlain = tar => (isObject(tar) && tar.isPlain)
export class Plain {
  constructor (value) {
    if (isPlain(value)) {
      return value
    }
    this._value = value
  }

  get isPlain () {
    return true
  }

  get value () {
    return this._value
  }

  static of (value) {
    return new Plain(value)
  }
}
