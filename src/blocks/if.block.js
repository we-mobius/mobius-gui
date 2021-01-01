import { isFunction } from '../libs/mobius-utils.js'
import { neatenChildren } from '../common/index.js'

export const makeIfB = ({ unique = '', children = [], config = {} }) => {
  const { condition = false, elseChidren = [] } = config
  const isRender = isFunction(condition) ? condition() : condition
  return isRender ? [...neatenChildren(children)] : [...neatenChildren(elseChidren)]
}
