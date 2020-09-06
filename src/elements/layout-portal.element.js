import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'
import { makeContainerE } from './container.element.js'
import {
  equiped,
  asFlexContainer,
  withFullAbs,
  withYScroll, withScrollbarHidden,
  withPresetHorizontal, withPresetVertical, withNoWrap,
  withJustifyBetween, withItemsStretch, asGrowItem,
  withPositionRelative,
  withTransitionAll
} from '../stylizers/index.js'

const makePortalLayoutE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {
    type: 'grid'
  }
}) => {
  const { type = 'grid' } = config
  const DOMS = {
    grid: withTransitionAll(div(
      `${selector}.mobius-size--fullpct.mobius-layout__portal`,
      hardDeepMerge(props, { dataset: { unique } }),
      [
        makeFlexContainerE(withPresetHorizontal(withJustifyBetween({
          selector: '.header',
          children: [...neatenChildren(children.header)]
        }))),
        makeFlexContainerE(withPresetVertical({
          selector: '.left',
          children: [...neatenChildren(children.left)]
        })),
        div('.main.mobius-shadow--inset.mobius-rounded--xs', [
          ...neatenChildren(children.main)
        ]),
        makeFlexContainerE(withPresetVertical({
          selector: '.right',
          children: [...neatenChildren(children.right)]
        }))
      ]
    )),
    flex: withTransitionAll(makeContainerE(equiped(asFlexContainer, withPresetVertical)({
      unique: unique,
      selector: `${selector}.mobius-size--fullpct`,
      children: [
        makeContainerE(equiped(asFlexContainer, withPresetHorizontal, withJustifyBetween)({
          children: [...neatenChildren(children.header)]
        })),
        makeContainerE(equiped(asFlexContainer, withPresetHorizontal, withItemsStretch, asGrowItem)({
          children: [
            makeContainerE(equiped(asFlexContainer, withPresetVertical)({
              children: [...neatenChildren(children.left)]
            })),
            makeContainerE(equiped(asFlexContainer, withPresetVertical, withPositionRelative, asGrowItem)({
              children: makeContainerE(equiped(asFlexContainer, withPresetVertical, withNoWrap, withFullAbs, withYScroll, withScrollbarHidden)({
                children: [...neatenChildren(children.main)]
              }))
            })),
            makeContainerE(equiped(asFlexContainer, withPresetVertical)({
              children: [...neatenChildren(children.right)]
            }))
          ]
        }))
      ]
    })))
  }
  return DOMS[type]
}

export { makePortalLayoutE }
