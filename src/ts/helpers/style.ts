import {
  isString, isArray, isPlainObject, isNormalFunction,
  toClassString, prefixClassWith, removePrefixOfClass
} from '../libs/mobius-utils'
import { Marker, Dirty, isDirty, isValidMarker } from './base'

import type { TemplatePieces } from './view'

export const prefixClassWithMobius = prefixClassWith('mobius-')
export const removeMobiusPrefixOfClass = removePrefixOfClass('mobius-')

const processValue = (
  prevString: string, value: any, styles: Record<string, any>, configs: Record<string, any>
): any => {
  const classReg = /class=('|"|`)?[^'"`=>]*$/ig

  if (classReg.test(prevString)) {
    if (isValidMarker(value)) {
      const standardMarker = Marker.of(value)
      // marker
      const marker = standardMarker.value
      const style = styles[marker]
      if (style === undefined) {
        console.warn(`There is no "${marker}" found in styles, use "${marker}" instead.`, styles)
        return Dirty.of(marker)
      } else if (isNormalFunction(style)) {
        return Dirty.of(toClassString(prefixClassWithMobius(style(configs))))
      } else {
        return Dirty.of(toClassString(prefixClassWithMobius(style)))
      }
    } else if (isString(value)) {
      // string
      return Dirty.of(toClassString(prefixClassWithMobius(value)))
    } else if (isPlainObject(value) || isArray(value)) {
      // plain object & array
      return Dirty.of(toClassString(prefixClassWithMobius(value)))
    } else if (isNormalFunction(value)) {
      // function
      return Dirty.of(toClassString(prefixClassWithMobius(value(configs))))
    } else {
      // unexpected
      throw (new TypeError(
        '"value" follows "class=" is expected to be type of ' +
        'Marker | String | Object | Array | Function, but receives ' +
        typeof value
      ))
    }
  } else if (isString(value)) {
    const marker = value
    const style = styles[marker]
    if (style === undefined) {
      return value
    } else {
      return Dirty.of(style)
    }
  } else {
    // TODO: implements other cases, e.g. boolean attribute bindings, text content bindings
    return value
  }
}

/**
 * Return a processor for tagged template.
 *
 * @description_i18n 处理模板中位于 `class=` | `class='` | `class="` 之后的值，
 *                   处理模板中的字符串值，包括但不限于文本节点，属性等
 */
export const style = (styles: Record<string, any>, configs: Record<string, any>) =>
  (templatePieces: TemplatePieces): TemplatePieces => {
    const { strings, values } = templatePieces
    const result = values.reduce<{ newValues: any[], prevString: string }>(
      (acc, value, index) => {
        // placeholder should comply with the valid classname format.
        const placeholder = '[[Mobius Placeholder]]'
        acc.prevString = acc.prevString + strings[index]

        let newValue
        // if value is marked as dirty, return it
        if (isDirty(value)) {
          newValue = value
        } else {
          newValue = processValue(acc.prevString, value, styles, configs)
        }

        acc.prevString = acc.prevString + placeholder
        acc.newValues.push(newValue)
        return acc
      }, { newValues: [], prevString: '' }
    )

    return {
      strings,
      values: result.newValues
    }
  }
