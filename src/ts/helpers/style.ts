import {
  isString, isArray, isObject, isFunction,
  toClassStr, prefixClassWith, removePrefixOfClass
} from '../libs/mobius-utils'
import { dirty, isDirty, isMarker } from './base'

export const prefixClassWithMobius = prefixClassWith('mobius-')
export const removeMobiusPrefixOfClass = removePrefixOfClass('mobius-')

const processValue = (prevString, value, styles, configs) => {
  const classReg = /class=('|"|`)?[^'"`=>]*$/ig
  if (classReg.test(prevString)) {
    // marker
    if (isMarker(value)) {
      const marker = value.value
      const style = styles[marker]
      if (style === undefined) {
        // console.warn(`There is no "${marker}" found in styles.`, styles)
        return dirty('')
      }
      if (isFunction(style)) {
        return dirty(toClassStr(prefixClassWithMobius(style(configs))))
      } else {
        return dirty(toClassStr(prefixClassWithMobius(style)))
      }
    }
    // string
    if (isString(value)) {
      const marker = value
      const style = styles[marker]
      if (style === undefined) {
        // console.warn(`There is no "${marker}" found in styles.`, styles)
        return dirty(marker)
      }
      if (isFunction(style)) {
        return dirty(toClassStr(prefixClassWithMobius(style(configs))))
      } else {
        return dirty(toClassStr(prefixClassWithMobius(style)))
      }
    }
    // object & array
    if (isObject(value) || isArray(value)) {
      return dirty(toClassStr(prefixClassWithMobius(value)))
    }
    // function
    if (isFunction(value)) {
      return dirty(toClassStr(prefixClassWithMobius(value(configs))))
    }
    // unexpected
    throw (new TypeError(
      '"value" follows "class=" is expected to be type of ' +
      'Marker | String | Object | Array | Function, but receives ' +
      typeof value
    ))
  }

  // TODO: implements other cases, e.g. boolean attribute bindings, text content bindings
  if (isString(value)) {
    const marker = value
    const style = styles[marker]
    if (style === undefined) {
      return value
    } else {
      return dirty(style)
    }
  }

  return value
}

export const style = (styles, configs) => (strings, ...values) => {
  const result = values.reduce((acc, value, idx) => {
    const placeholder = '[[Mobius Placeholder]]'
    acc.prevString = acc.prevString + strings[idx]

    let newValue
    // if value is dirty, do nothing
    if (isDirty(value)) {
      newValue = value
    } else {
      newValue = processValue(acc.prevString, value, styles, configs)
    }

    acc.prevString = acc.prevString + placeholder
    acc.newValues.push(newValue)
    return acc
  }, { newValues: [], prevString: '' })

  return [strings, ...result.newValues]
}
