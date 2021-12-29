import { isBoolean, isString, isNormalFunction } from '../libs/mobius-utils'
import { createElementMaker } from '../helpers/index'

import type { ElementOptions } from '../helpers/index'

interface Setters {
  [key: string]: (value: any) => any
}

const classesSetter: Setters = {
  contentContainerClasses: c => {
    const defaultClasses = 'border--all border--primary rounded--base padding--base '
    if (isBoolean(c)) {
      return c ? defaultClasses : ''
    } else if (isString(c)) {
      return defaultClasses + ' ' + c
    } else if (isNormalFunction(c)) {
      return c(defaultClasses)
    } else {
      return c
    }
  }
}
const applySpec = <T extends Record<string, any>>(setters: Setters, target: T): T => {
  Object.entries(setters).forEach(([prop, setter]) => {
    if (prop in target) {
      target[prop as keyof T] = setter(target[prop])
    }
  })
  return target
}

export interface MaskElementOptions extends ElementOptions {
  styles?: {
    isShow?: boolean
    rootClasses?: string
    maskClasses?: string
    contentContainerClasses?: string
    content?: string
  }
  actuations?: {
    clickHandler?: (event: Event) => void
  }
}

/**
 *
 */
export const makeMaskE = createElementMaker<MaskElementOptions>({
  marks: {},
  styles: {
    isShow: false,
    rootClasses: '',
    maskClasses: '',
    contentContainerClasses: '',
    content: ''
  },
  actuations: {
    clickHandler: (event) => { console.warn('Mask need an eventHandler!') }
  },
  configs: {},
  prepareTemplate: (view, { styles, utils: { prefix } }) => {
    const { rootClasses, maskClasses, contentContainerClasses, isShow } = applySpec(classesSetter, { ...styles })

    return view`
      <div
        class=${prefix('size--fullabs position--relative layout__horizontal flex-justify--center flex-items--center ' + rootClasses)}
        style='display: ${isShow ? 'flex' : 'none'}'
      >
        <div
          class=${prefix('size--fullabs bg--third visible--medium ' + maskClasses)}
          @click=${'clickHandler'}
        ></div>
        <div
          class=${prefix('position--z-toppest overflow--hidden ' + contentContainerClasses)}
        >
          ${styles.content}
        </div>
      </div>
    `
  }
})
