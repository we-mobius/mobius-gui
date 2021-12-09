import { isString } from '../libs/mobius-utils'
import { Dirty, isDirty, isMarker, isPlain } from './base'

import type { TemplatePieces } from './view'

/**
 * Return a processor for tagged template.
 *
 * @description_i18n 处理模板中位于 `id=` | `id='` | `id="` 之后的值
 */
export const mark = (marks: Record<string, string>, configs: Record<string, any>) =>
  (templatePieces: TemplatePieces): TemplatePieces => {
    const { strings, values } = templatePieces
    const newValues = values.map((value, index) => {
      // if value is marked as dirty, return it
      if (isDirty(value)) {
        return value
      }

      const prevString = strings[index]
      const idReg = /id=('|"|`)?$/ig

      if (idReg.test(prevString)) {
        if (isMarker(value)) {
          const marker = value.value
          const mark = marks[marker]
          if (mark !== undefined) {
            return Dirty.of(mark)
          } else {
            console.warn(`There is no "${marker}" found in marks, use "${marker}" instead.`, marks)
            return Dirty.of(marker)
          }
        } else if (isPlain(value)) {
          return Dirty.of(value.value)
        } else if (isString(value)) {
          return marks[value] ?? value
        } else {
          return value
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
