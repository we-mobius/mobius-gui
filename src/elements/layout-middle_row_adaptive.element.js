import { neatenChildren } from '../common/index.js'
import { makeContainerE } from './container.element.js'
import {
  equiped,
  asFlexContainer, withPresetVertical, withNoWrap, asGrowItem, asNoShrinkItem,
  withFullPct,
  withPositionRelative, withPositionAbsolute
} from '../stylizers/index.js'

const makeMiddleRowAdaptiveLayoutE = ({
  unique, selector = '', props = {}, children = {}, text = undefined, config = {}
} = {}) => {
  const { top, middle, bottom } = children
  const { withAbsMidWrapper = true } = config
  const resChildren = []

  const topChildren = top
  const middleChildren = !middle ? children
    : withAbsMidWrapper ? makeContainerE(equiped(withPositionAbsolute, withFullPct)({
      children: [...neatenChildren(middle)]
    })) : children.middle
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
    children: [...resChildren]
  }))
}

export { makeMiddleRowAdaptiveLayoutE }
