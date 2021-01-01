import { div, span } from '../libs/dom.js'
import { hardDeepMerge, prop, argPlaceholder as _ } from '../libs/mobius-utils.js'

const typeToIconname = prop(_, {
  error: 'error',
  info: 'info',
  success: 'success',
  warn: 'warnning',
  warnning: 'warnning',
  help: 'help',
  ban: 'ban',
  banning: 'ban',
  default: 'info'
})
const typeToColor = prop(_, {
  error: 'red',
  info: 'blue',
  success: 'green',
  warn: 'orange',
  warnning: 'orange',
  help: 'yellow',
  ban: 'red',
  banning: 'red',
  default: 'gray'
})

const makeTipE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
} = {}) => {
  const { type, message } = config
  const iconname = typeToIconname(type)
  const color = typeToColor(type)

  return div(
    `${unique ? '.js_' + unique : ''}${selector}.mobius-text--${color}`,
    hardDeepMerge(props, { dataset: { unique } }),
    [span(`.mobius-icon.mobius-icon-${iconname}.mobius-margin-right--xs`), message]
  )
}

export { makeTipE }
