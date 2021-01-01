import { makeDOMDriver } from '../libs/dom.js'

export const inDOM = selector => ({
  DOM: makeDOMDriver(selector)
})
