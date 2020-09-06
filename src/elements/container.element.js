import { div } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'
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
