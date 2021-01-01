import { isFunction, hasOwnProperty } from '../libs/mobius-utils.js'
import { neatenChildren } from '../common/index.js'

export const makeSwitchB = ({ unique = '', children = [], config = {} }) => {
  const { condition = 'default' } = config
  const toRender = isFunction(condition) ? condition() : condition
  const isRender = hasOwnProperty(toRender, children)
  return isRender ? [...neatenChildren(children[toRender])] : []
}
