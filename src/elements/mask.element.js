import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'

export const defaultMaskElementConfig = { isShow: false, style: 'dark' }

const getBackground = style => {
  const dict = {
    // TODO: light color
    light: 'transparent',
    dark: 'hsla(264, 0%, 2%, 50%)',
    transparent: 'transparent'
  }
  return dict[style]
}

export const makeMaskE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
} = {}) => {
  const { isShow = false, style = 'dark' } = config

  return div(
    `${unique ? '.js_' + unique : ''}${selector}`,
    hardDeepMerge(props, {
      dataset: { unique },
      style: {
        backgroundColor: getBackground(style),
        display: isShow ? 'block' : 'none'
      }
    }),
    []
  )
}
