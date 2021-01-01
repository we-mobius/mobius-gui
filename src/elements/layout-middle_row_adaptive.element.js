import {
  isArray, isObject, anyPass, allPass, hasOwnProperty, isEmptyObj
} from '../libs/mobius-utils.js'
import { neatenChildren, equiped } from '../common/index.js'
import { makeContainerE } from './container.element.js'
import {
  asFlexContainer, withPresetVertical, withNoWrap, asGrowItem, asNoShrinkItem,
  withFullPct,
  withPositionRelative, withPositionAbsolute
} from '../stylizers/index.js'

const _isRecommondChildren = allPass([
  isObject, anyPass([isEmptyObj, hasOwnProperty('top'), hasOwnProperty('middle'), hasOwnProperty('bottom')])
])

export const makeMiddleRowAdaptiveLayoutE = elementOptions => {
  const { unique, selector = '', props = {}, children = {}, config = {} } = elementOptions
  let top, middle, bottom
  if (_isRecommondChildren(elementOptions)) {
    top = elementOptions.top
    middle = elementOptions.middle
    bottom = elementOptions.bottom
  }
  if (_isRecommondChildren(children)) {
    top = children.top || top
    middle = children.middle || middle
    bottom = children.bottom || bottom
  } else if (isArray(children) && _isRecommondChildren(children[0])) {
    top = children[0].top || top
    middle = children[0].middle || middle
    bottom = children[0].bottom || bottom
  } else {
    middle = children || middle
  }

  const { withAbsMidWrapper = true } = config
  const resChildren = []

  const topChildren = top
  const middleChildren = !middle ? middle : withAbsMidWrapper ? makeContainerE(equiped(withPositionAbsolute, withFullPct)({
    children: [...neatenChildren(middle)]
  })) : [...neatenChildren(middle)]
  const bottomChildren = bottom

  topChildren && resChildren.push(
    makeContainerE(equiped(asFlexContainer, asNoShrinkItem)({
      children: [...neatenChildren(topChildren)]
    }))
  )
  middleChildren && resChildren.push(
    makeContainerE(equiped(asFlexContainer, withPositionRelative, asGrowItem)({
      children: [...neatenChildren(middleChildren)]
    }))
  )
  bottomChildren && resChildren.push(
    makeContainerE(equiped(asFlexContainer, asNoShrinkItem)({
      children: [...neatenChildren(bottomChildren)]
    }))
  )

  return makeContainerE(equiped(asFlexContainer, withPresetVertical, withNoWrap)({
    unique: unique,
    selector: `${selector}`,
    props: { ...props },
    children: [...resChildren],
    config: { ...config }
  }))
}
