import {
  isArray, isObject, anyPass, allPass, hasOwnProperty, isEmptyObj
} from '../libs/mobius-utils.js'
import { neatenChildren, equiped } from '../common/index.js'
import { makeContainerE } from './container.element.js'
import {
  asFlexContainer, withPresetHorizontal, withNoWrap, withItemsStretch, asGrowItem, asNoShrinkItem,
  withFullPct,
  withPositionRelative, withPositionAbsolute
} from '../stylizers/index.js'

const _isRecommondChildren = allPass([
  isObject, anyPass([isEmptyObj, hasOwnProperty('left'), hasOwnProperty('middle'), hasOwnProperty('right')])
])

export const makeMiddleColAdaptiveLayoutE = elementOptions => {
  const { unique, selector = '', props = {}, children = {}, config = {} } = elementOptions
  let left, middle, right
  if (_isRecommondChildren(elementOptions)) {
    left = elementOptions.left
    middle = elementOptions.middle
    right = elementOptions.right
  }
  if (_isRecommondChildren(children)) {
    left = children.left || left
    middle = children.middle || middle
    right = children.right || right
  } else if (isArray(children) && _isRecommondChildren(children[0])) {
    left = children[0].left || left
    middle = children[0].middle || middle
    right = children[0].right || right
  } else {
    middle = children || middle
  }

  const { withAbsMidWrapper = true } = config
  const resChildren = []

  const leftChildren = left
  const middleChildren = !middle ? middle : withAbsMidWrapper ? makeContainerE(equiped(withPositionAbsolute, withFullPct)({
    children: [...neatenChildren(middle)]
  })) : [...neatenChildren(middle)]
  const rightChildren = right

  leftChildren && resChildren.push(
    makeContainerE(equiped(asFlexContainer, asNoShrinkItem)({
      children: [...neatenChildren(leftChildren)]
    }))
  )
  middleChildren && resChildren.push(
    makeContainerE(equiped(asFlexContainer, withPositionRelative, asGrowItem)({
      children: [...neatenChildren(middleChildren)]
    }))
  )
  rightChildren && resChildren.push(
    makeContainerE(equiped(asFlexContainer, asNoShrinkItem)({
      children: [...neatenChildren(rightChildren)]
    }))
  )

  return makeContainerE(equiped(asFlexContainer, withPresetHorizontal, withItemsStretch, withNoWrap)({
    unique: unique,
    selector: `${selector}`,
    props: { ...props },
    children: [...resChildren],
    config: { ...config }
  }))
}
