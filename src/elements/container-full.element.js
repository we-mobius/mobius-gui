import { div } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const makeFullContainerE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {
    type: ''
  }
}) => {
  let { type } = config
  type = type || 'size'
  const DOMS = {
    size: div(
      `${selector}.mobius-size--fullpct`,
      hardDeepMerge(props, { dataset: { unique } }),
      [...neatenChildren(children)]
    ),
    abs: div(
      `${selector}.mobius-size--fullabs`,
      hardDeepMerge(props, { dataset: { unique } }),
      [...neatenChildren(children)]
    )
  }
  return DOMS[type]
}

export { makeFullContainerE }
