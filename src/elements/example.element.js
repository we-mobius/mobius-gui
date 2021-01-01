import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { neatenChildren } from '../common/index.js'

export const makeElementNameE = elementOptions => {
  const {
    unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
  } = elementOptions

  return div(
    `${selector}`,
    hardDeepMerge(props, { dataset: { unique } }),
    [...neatenChildren(children)]
  )
}
