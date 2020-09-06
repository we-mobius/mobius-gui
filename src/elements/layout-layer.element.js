import { div } from '../libs/dom.js'
import { hardDeepMerge, asIs } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'
import { withFullAbs } from '../stylizers/index.js'

const makeLayerLayoutE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
} = {}) => {
  const { stretchingChildren = false } = config
  const childrenHandler = stretchingChildren ? withFullAbs : asIs
  return div(
    `${unique ? '.js_' + unique : ''}${selector}.mobius-size--fullpct.mobius-position--relative`,
    hardDeepMerge(props, { dataset: { unique } }),
    [...neatenChildren(children).map(childrenHandler)]
  )
}

export { makeLayerLayoutE }
