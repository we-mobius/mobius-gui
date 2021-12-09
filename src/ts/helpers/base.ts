import { isString, isObject, isFunction } from '../libs/mobius-utils'

type QuotedString = `"${string}"` | `'${string}'` | `\`${string}\``

/**
 * Predicate whether the target string is quoted.
 */
const isQuotedString = (tar: string): tar is QuotedString => {
  if (!isString(tar)) {
    throw (new TypeError('"tar" is expected to be type of "string".'))
  }
  // "", '', `` are not be considered as quoted.
  if (tar.length < 3) {
    return false
  }
  const s = tar[0] + tar[tar.length - 1]
  const isQuoted = s === '""' || s === "''" || s === '``'

  return isQuoted
}
/**
 * Remove the start and end quotes from the target string.
 *   But do not check the existence of the quotes or if the quotes are matched.
 */
const removeQuote = (str: QuotedString): string => str.slice(1, str.length - 1)

type MarkerUnion = QuotedString | Marker

/**
 * Predicate whether the target string is a valid marker, i.e. `QuotedString` or instance of `Marker`.
 */
export const isValidMarker = (tar: any): tar is MarkerUnion => (isString(tar) && isQuotedString(tar)) || isMarker(tar)

/**
 * Predicate whether the target string is an instance of `Marker`.
 */
export const isMarker = (tar: any): tar is Marker => (isObject(tar) && tar.isMarker)

/**
 *
 */
export class Marker {
  _value: string

  constructor (value: string) {
    if (!isString(value) || value.length === 0) {
      throw (new TypeError('"value" is expected to be non-empty string.'))
    }
    if (isQuotedString(value)) {
      this._value = removeQuote(value)
    } else {
      this._value = value
    }
  }

  get isMarker (): true { return true }

  get value (): string { return this._value }

  static of (value: MarkerUnion | (() => MarkerUnion)): Marker {
    if (isFunction(value)) {
      return Marker.of(value())
    } else if (isMarker(value)) {
      return value
    } else {
      return new Marker(value)
    }
  }
}

/**
 * Predicate whether the target is an instance of `Plain`.
 */
export const isPlain = (tar: any): tar is Plain => isObject(tar) && tar.isPlain

/**
 *
 */
export class Plain<V = any> {
  _value: V

  constructor (value: V) {
    this._value = value
  }

  get isPlain (): boolean { return true }

  get value (): V { return this._value }

  static of <V extends Plain> (value: V): V
  static of <V> (value: V): Plain<V>
  static of (value: any): Plain {
    if (isPlain(value)) {
      return value
    } else {
      return new Plain(value)
    }
  }
}

/**
 * Predicate whether the target is an instance of `Dirty`.
 */
export const isDirty = <V = any>(tar: any): tar is Dirty<V> => isObject(tar) && tar.isDirty

/**
 *
 */
export class Dirty<V = any> {
  _value: V
  constructor (value: V) {
    this._value = value
  }

  get isDirty (): boolean { return true }
  get value (): V { return this._value }

  static of <V extends Dirty>(value: V): V
  static of <V extends any>(value: V): Dirty<V>
  static of (value: any): Dirty {
    if (isDirty(value)) {
      return value
    } else {
      return new Dirty(value)
    }
  }
}
