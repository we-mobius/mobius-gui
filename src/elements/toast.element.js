import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'
import { makeIfB } from '../blocks/if.block.js'

const baseSelector = '.mobius-layout__vertical.mobius-flex-items--center.mobius-padding-x--base.mobius-padding-y--xs.mobius-rounded--xs'

const buildToastElementConfig = (type, icon) => {
  type = type || (icon ? 'custom' : 'default')
  const dict = {
    loading: `.mobius-icon.mobius-icon-${icon || 'loading--bare'}.mobius-animation--spin`,
    error: `.mobius-icon.mobius-icon-${icon || 'error--bare'}`,
    success: `.mobius-icon.mobius-icon-${icon || 'success--bare'}`,
    custom: `.mobius-icon.mobius-icon-${icon}`,
    default: ''
  }
  return dict[type]
}

// TODO: icon & font color
export const makeToastE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
} = {}) => {
  const { type, icon, title } = config
  const toastElementConfig = buildToastElementConfig(type, icon)

  return div(
    `${unique ? '.js_' + unique + '__inner' : ''}${selector}${baseSelector}.mobius-text--2xl.mobius-text--light`,
    hardDeepMerge(props, {
      dataset: { unique },
      style: { backgroundColor: 'hsla(264, 0%, 2%, 50%)' }
    }),
    [
      ...makeIfB({
        children: [div(`.mobius-text--4xl${toastElementConfig}`)],
        config: { condition: !!toastElementConfig }
      }),
      ...makeIfB({
        children: [div('.mobius-text--r-base', title)],
        config: { condition: !!title }
      })
    ]
  )
}
