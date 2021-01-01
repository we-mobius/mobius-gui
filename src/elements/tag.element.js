import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { neatenChildren } from '../common/index.js'

const baseSelector = '.mobius-flex-shrink--0.mobius-text-leading--large.mobius-padding-x--r-xs.mobius-border--all.mobius-border--thin.mobius-rounded--full.mobius-cursor--pointer'
const selectedSelector = '.mobius-text--primary'

export const makeTagE = elementOptions => {
  const {
    unique, selector = '', props = {}, children = undefined, config = {}
  } = elementOptions

  const { text, selected, value } = config

  return div(
    `${selector}${baseSelector}${selected ? selectedSelector : ''}`,
    hardDeepMerge(props, { dataset: { unique, value } }),
    [text]
  )
}
