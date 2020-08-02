import { div } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const makeElementNameE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {

  }
}) => {
  return div(
    `${selector}`,
    hardDeepMerge(props, { dataset: { unique } }),
    [...neatenChildren(children)]
  )
}

export { makeElementNameE }
