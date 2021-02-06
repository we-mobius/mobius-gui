import { div, span } from '../libs/dom.js'
import { makeContainerE } from './container.element.js'
import { equiped } from '../common/index.js'
import {
  asFlexContainer,
  withPresetHorizontal, withJustifyBetween,
  asGrowItem,
  withFullPctWidth
} from '../stylizers/index.js'
import { makeForB } from '../blocks/for.block.js'

const makeTabVNode = ({ text, icon, selected, dataset }) => {
  return asGrowItem(div(`.js_mobius-tabbar__tab.mobius-padding-y--xs.mobius-text--center.mobius-text-leading--xs${selected ? '.mobius-text--primary' : ''}`,
    { dataset: { ...dataset } },
    [
      div(`${icon ? '.mobius-icon.mobius-icon-' + icon : ''}.mobius-text--xxxxl.mobius-events--none`),
      span('.mobius-text--xs.mobius-events--none', text)
    ]
  ))
}

const makeTabbarE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
}) => {
  const { list = [] } = config
  return makeContainerE(equiped(asFlexContainer, withPresetHorizontal, withJustifyBetween, withFullPctWidth)({
    unique: unique,
    selector: `${selector}.js_mobius-tabbar.mobius-border--top.mobius-border--thin`,
    props: {
      ...props,
      style: {
        '--border-color': 'hsla(264, 0%, 68%, 50%)'
      }
    },
    children: [...makeForB({
      config: {
        data: list,
        target: makeTabVNode
      }
    })],
    config: { ...config }
  }))
}

export { makeTabbarE }
