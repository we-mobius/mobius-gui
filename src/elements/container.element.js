import { div } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const makeContainerE = ({
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

export { makeContainerE }
