import { isString, isObject, isArray, curry } from '../libs/mobius-utils.js'

// makeUniqueSelector :: s -> s -> s
export const makeUniqueSelector = curry((unique, suffix) => {
  suffix = suffix || ''
  return `${unique ? '.js_' + unique + (suffix ? '__' + suffix : '') : ''}`
})

export const toSelectors = input => {
  if (isString(input)) return input
  if (isArray(input)) return '.' + input.join('.')
  if (isObject(input)) return '.' + Object.entries(input).filter(([key, value]) => !!value).map(([key, value]) => key).join('.')
}
export const toClassesArr = input => {
  if (isString(input)) return input.split('.').slice(1)
  if (isArray(input)) return input
  if (isObject(input)) return Object.entries(input).filter(([key, value]) => !!value).map(([key, value]) => key)
}
export const toClassesObj = (input, boo) => {
  if (isString(input)) {
    return input.split('.').slice(1).reduce((obj, classname) => {
      obj[classname] = boo === undefined ? true : boo
      return obj
    }, {})
  }
  if (isArray(input)) {
    return input.reduce((obj, classname) => {
      obj[classname] = boo === undefined ? true : boo
      return obj
    }, {})
  }
  if (isObject(input)) {
    Object.entries(input).forEach(([key, value]) => {
      input[key] = !!value
    })
    return input
  }
}

export const selectorsToClasses = selectors => selectors.split('.').filter(_class => !!_class)
export const selectorsToClassesObj = (selectors, base) => selectorsToClasses(selectors).reduce((obj, cur) => {
  obj[cur] = true
  return obj
}, toClassesObj(base, false))

export const patchClassesToElm = (classes, elm) => {
  Object.keys(toClassesObj(classes)).forEach(classname => {
    if (classes[classname]) {
      elm.classList.add(classname)
    } else {
      elm.classList.remove(classname)
    }
  })
}

export const makeCustomEvent = (type, detail, options) => new CustomEvent(type, { ...(options || {}), detail: { eventType: type, ...(detail || {}) } })
