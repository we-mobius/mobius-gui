import { neatenChildren } from '../common/index.js'
import { makeContainerE } from './container.element.js'
import {
  equiped,
  asFlexContainer, withPresetHorizontal, withNoWrap, withItemsStretch, asGrowItem, asNoShrinkItem,
  withFullPct,
  withPositionRelative, withPositionAbsolute
} from '../stylizers/index.js'

const makeMiddleColAdaptiveLayoutE = ({
  unique, selector = '', props = {}, children = {}, text = undefined, config = {}
} = {}) => {
  const { left, middle, right } = children
  const { withAbsMidWrapper = true } = config
  const resChildren = []

  const leftChildren = left
  const middleChildren = !middle ? children
    : withAbsMidWrapper ? makeContainerE(equiped(withPositionAbsolute, withFullPct)({
      children: [...neatenChildren(middle)]
    })) : children.middle
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

export { makeMiddleColAdaptiveLayoutE }
