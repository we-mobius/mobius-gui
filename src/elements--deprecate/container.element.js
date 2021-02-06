import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { neatenChildren } from '../common/index.js'

const makeContainerE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
}) => {
  return div(
    `${unique ? '.js_' + unique : ''}${selector}`,
    hardDeepMerge(props, { dataset: { unique } }),
    [...neatenChildren(children)]
  )
}

export { makeContainerE }
