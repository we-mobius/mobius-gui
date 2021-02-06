
import { isArray, semantic } from '../libs/mobius-utils.js'

export const { equip, equiped } = semantic

const neatenChildren = children => isArray(children) ? children : [children]

export {
  neatenChildren
}

export * from './element.common.js'
export * from './component.common.js'
// export * from './driver.common.js'
// export * from './part.common.js'

export * from './form.common.js'
