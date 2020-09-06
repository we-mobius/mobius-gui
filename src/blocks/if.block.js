import { isFunction } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const makeIfB = ({ unique = '', children = [], config = {} }) => {
  const { condition = false, elseChidren = [] } = config
  const isRender = isFunction(condition) ? condition() : condition
  return isRender ? [...neatenChildren(children)] : [...neatenChildren(elseChidren)]
}

export { makeIfB }
