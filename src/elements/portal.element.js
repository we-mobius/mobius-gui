import { div } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'
import { makeFlexContainerE } from './container-flex.element.js'
import {
  equiped,
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
    flex: withTransitionAll(makeFlexContainerE(withPresetVertical({
      unique: unique,
      selector: `${selector}.mobius-size--fullpct`,
      children: [
        makeFlexContainerE(withPresetHorizontal(withJustifyBetween({
          children: [...neatenChildren(children.header)]
        }))),
        makeFlexContainerE(withPresetHorizontal(withItemsStretch(asGrowItem({
          children: [
            makeFlexContainerE(withPresetVertical({
              children: [...neatenChildren(children.left)]
            })),
            makeFlexContainerE(withPresetVertical(withPositionRelative(asGrowItem({
              children: makeFlexContainerE(equiped(withPresetVertical, withNoWrap, withFullAbs, withYScroll, withScrollbarHidden)({
                children: [...neatenChildren(children.main)]
              }))
              // children: makeFlexContainerE(withPresetVertical(withNoWrap(withFullAbs(withYScroll(withScrollbarHidden({
              //   children: [...neatenChildren(children.main)]
              // }))))))
            })))),
            makeFlexContainerE(withPresetVertical({
              children: [...neatenChildren(children.right)]
            }))
          ]
        }))))
      ]
    })))
  }
  return DOMS[type]
}

export { makePortalLayoutE }
