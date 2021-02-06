import { isString } from '../libs/mobius-utils.js'
import { dirty, isDirty, isMarker, isPlain } from './base.js'

export const mark = (marks, configs) => (strings, ...values) => {
  const newValues = values.map((value, idx) => {
    if (isDirty(value)) {
      return value
    }

    const prevString = strings[idx]
    const idReg = /id=('|"|`)?$/ig

    if (idReg.test(prevString)) {
      if (isMarker(value)) {
        const marker = value.value
        const mark = marks[marker]
        if (mark !== undefined) {
          return dirty(mark)
        } else {
          console.warn(`There is no "${marker}" found in marks.`, marks)
          return dirty('') // id=''
        }
      } else if (isPlain(value)) {
        return dirty(value.value)
      } else if (isString(value)) {
        return marks[value] || value
      } else {
        return value
      }
    }

    return value
  })

  return [strings, ...newValues]
}
