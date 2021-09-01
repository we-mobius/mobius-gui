import { isBoolean, isString, isFunction } from '../libs/mobius-utils.js'
import { makeElementMaker } from '../helpers/index.js'

const classesSetter = {
  contentContainerClasses: c => {
    const defaultClasses = 'border--all border--primary rounded--base padding--base '
    if (isBoolean(c)) {
      return c ? defaultClasses : ''
    } else if (isString(c)) {
      return defaultClasses + ' ' + c
    } else if (isFunction(c)) {
      return c(defaultClasses)
    } else {
      return c
    }
  }
}
const applySpec = (fns, target) => {
  Object.entries(fns).forEach(([k, v]) => {
    if (target[k] !== undefined) {
      target[k] = v(target[k])
    }
  })
  return target
}

export const makeMaskE = makeElementMaker({
  marks: {},
  styles: {
    rootClasses: '',
    maskClasses: '',
    contentContainerClasses: '',
    isShow: false,
    content: ''
  },
  actuations: {
    clickHandler: e => { console.warn('Mask need an eventHandler!') }
  },
  configs: {},
  handler: (view, { styles, utils: { prefix } }) => {
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
