import { isFunction, hasOwnProperty } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const makeSwitchB = ({ unique = '', children = [], config = {} }) => {
  const { condition = 'default' } = config
  const toRender = isFunction(condition) ? condition() : condition
  const isRender = hasOwnProperty(toRender, children)
  return isRender ? [...neatenChildren(children[toRender])] : []
}

export { makeSwitchB }
