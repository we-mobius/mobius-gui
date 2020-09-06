import { makeDOMDriver } from '@cycle/dom'

const inDOM = selector => {
  return {
    DOM: makeDOMDriver(selector)
  }
}

export {
  inDOM
}
