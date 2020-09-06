import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const defaultPopoutElementConfig = { isShow: false }

const makePopoutE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
} = {}) => {
  const { isShow = false } = config
  return div(
    `${unique ? '.js_' + unique : ''}${selector}`,
    hardDeepMerge(props, {
      dataset: { unique },
      style: {
        display: isShow ? 'block' : 'none'
      }
    }),
    [...neatenChildren(children)]
  )
}

export { makePopoutE, defaultPopoutElementConfig }
