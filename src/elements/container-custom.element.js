import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { neatenChildren } from '../common/index.js'

const makeCustomContainerE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {
    isShow: true,
    width: '',
    height: ''
  }
}) => {
  const { isShow = true, width, height } = config
  return div(
    `${selector}`,
    hardDeepMerge(props, {
      dataset: { unique },
      style: {
        display: isShow ? 'block' : 'none',
        width: width || 'auto',
        height: height || 'auto'
      }
    }),
    [...neatenChildren(children)]
  )
}

export { makeCustomContainerE }
