import { isString, isFunction, isObject } from '../libs/mobius-utils'
import { dirty, isDirty, isMarker } from './base'

export const actuate = (actuations, configs) => (strings, ...values) => {
  const newValues = values.map((value, idx) => {
    if (isDirty(value)) {
      return value
    }

    const prevString = strings[idx]
    const reg = /@\w+=('|"|`)?$/ig
    if (reg.test(prevString)) {
      // marker
      if (isMarker(value)) {
        const marker = value.value
        const actuation = actuations[marker]
        if (actuation !== undefined) {
          return dirty(actuation)
        } else {
          console.warn(`There is no "${marker}" found in actuations.`, actuations)
          return dirty(e => {
            console.warn(`Event has been triggered to default actuation "${marker}", set a explicit value to avoid this behavior.`)
            return e
          })
        }
      }
      // string
      if (isString(value)) {
        const actuation = actuations[value]
        if (actuation !== undefined) {
          return dirty(actuation)
        } else {
          console.warn(`There is no "${value}" found in actuations.`, actuations)
          return dirty(e => {
            console.warn(`Event has been triggered to default actuation "${value}", set a explicit value to avoid this behavior.`)
            return e
          })
        }
      }
      // function
      if (isFunction(value)) {
        return dirty(value)
      }
      // object
      if (isObject(value) && isFunction(value.handleEvent)) {
        return dirty(value)
      }
      throw (new TypeError('Unexpected value received as event listeners!'))
    }

    return value
  })

  return [strings, ...newValues]
}
