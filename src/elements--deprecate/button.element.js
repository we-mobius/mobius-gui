import { div, span } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { makeIfB } from '../blocks/if.block.js'

const baseBtnClass = '.mobius-layout__horizontal.mobius-flex--inline.mobius-flex-justify--center' +
  '.mobius-padding-x--base.mobius-padding-y--xs.mobius-border--all.mobius-rounded--small.mobius-text--bold.mobius-text--primary' +
  '.active_mobius-bg--convex.cursor-pointer'

// TODO: 监听键盘事件 Enter or Space，并转而触发 click 事件
//   -> @see: https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
const makeButtonE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
} = {}) => {
  const { icon, title } = config
  return div(
    `${unique ? '.js_' + unique : ''}${selector}${baseBtnClass}`,
    hardDeepMerge(props, { dataset: { unique }, attrs: { role: 'button' } }),
    [
      ...makeIfB({
        chilren: [span(`.mobius-icon.mobius-icon-${icon}.mobius-text--2xl.mobius-padding-right--xs`)],
        condition: !!icon
      }),
      title
    ]
  )
}

export { makeButtonE }
