import { div, span } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'

const baseBtnClass = '.mobius-width--3rem.mobius-height--3rem.mobius-margin--xs.mobius-rounded--xs' +
   '.hover_mobius-bg--convex.cursor-pointer.mobius-layout__horizontal.mobius-flex-justify--center'
const normalBtnClass = '.mobius-shadow--normal.hover_mobius-text--primary'
const pressedBtnClass = '.mobius-shadow--inset.mobius-text--primary'

const makePressButtonE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {}
} = {}) => {
  const { name, icon, title, pressed } = config
  return div(
    `${unique ? '.js_' + unique : ''}${selector}${baseBtnClass}${pressed ? pressedBtnClass : normalBtnClass}`,
    hardDeepMerge(props, { dataset: { unique, name } }),
    [
      span(`${icon ? '.mobius-icon.mobius-icon-' + icon : ''}.mobius-text--2xl`),
      title
    ]
  )
}

export { makePressButtonE }
