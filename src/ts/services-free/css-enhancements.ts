// /* eslint-disable @typescript-eslint/no-namespace */
import { isUndefined } from '../libs/mobius-utils'

import type { AnyStringRecord } from '../libs/mobius-utils'

/**
 * Rely on the `@types/css`.
 */

/**
 * @refer https://developer.mozilla.org/en-US/docs/Web/API/CSS/RegisterProperty
 */
export const initMobiusCSS = (): void => {
  const customProps: AnyStringRecord = {
    color: ['--start-color', '--end-color']
  }

  console.info('[MobiusCSS] initMobiusCSS')

  if (isUndefined(window.CSS)) {
    return
  } else {
    console.info('[MobiusCSS] initMobiusCSS: window.CSS detected', window.CSS)
  }

  if (!isUndefined(CSS.registerProperty)) {
    console.info('[MobiusCSS] initMobiusCSS: window.CSS.registerProperty detected')
    Object.keys(customProps).forEach(key => {
      if (isUndefined(customProps[key])) {
        customProps[key].forEach((prop: any): void => {
          CSS.registerProperty({
            name: prop,
            syntax: '<' + key + '>',
            inherits: false,
            initialValue: 'transparent'
          })
        })
      }
    })
  }
}
