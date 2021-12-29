import { isString, isNormalFunction, isPlainObject } from '../libs/mobius-utils'
import { Dirty, isDirty, isMarker } from './base'

import type { TemplatePieces } from './view'

const defaultWarnningActuation = (marker: string) => (event: Event): Event => {
  console.warn(`Event has been triggered to default actuation "${marker}", set a explicit value to avoid this behavior.`)
  return event
}

/**
 * Return a processor for tagged template.
 *
 * @description_i18n 处理模板中位于 `class=` | `class='` | `class="` 之后的值
 */
export const actuate = (actuations: Record<string, any>, configs: Record<string, any>) =>
  (templatePieces: TemplatePieces): TemplatePieces => {
    const { strings, values } = templatePieces

    const newValues = values.map((value, index) => {
      // if value is marked as dirty, return it
      if (isDirty(value)) {
        return value
      }

      const prevString = strings[index]
      const eventReg = /@\w+=('|"|`)?$/ig
      if (eventReg.test(prevString)) {
        if (isMarker(value)) {
          // marker
          const marker = value.value
          const actuation = actuations[marker]
          if (actuation === undefined) {
            console.warn(`There is no "${marker}" found in actuations, use "defaultWarnningActuation" instead.`, actuations)
            return Dirty.of(defaultWarnningActuation(marker))
          } else if (isNormalFunction(actuation)) {
            return Dirty.of((event: Event) => actuation(event, configs))
          } else {
            return Dirty.of(actuation)
          }
        } else if (isString(value)) {
          // string
          const actuation = actuations[value]
          if (actuation === undefined) {
            console.warn(`There is no "${value}" found in actuations, use "defaultWarnningActuation" instead.`, actuations)
            return Dirty.of(defaultWarnningActuation(value))
          } else if (isNormalFunction(actuation)) {
            return Dirty.of((event: Event) => actuation(event, configs))
          } else {
            return Dirty.of(actuation)
          }
        } else if (isNormalFunction(value)) {
          // function
          return Dirty.of((event: Event) => value(event, configs))
        } else if (isPlainObject(value) && isNormalFunction(value.handleEvent)) {
          // object
          return Dirty.of({ ...value, handleEvent: (event: Event) => value.handleEvent(event, configs) })
        } else {
          throw (new TypeError('Unexpected value received as event listener.'))
        }
      } else {
        return value
      }
    })

    return {
      strings,
      values: newValues
    }
  }
