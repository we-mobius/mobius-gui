import { div, span } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'

const baseBtnClass = '.js_mobius-button' +
   '.mobius-width--3rem.mobius-height--3rem.mobius-margin--xs.mobius-rounded--xs' +
   '.hover_mobius-bg--convex.cursor-pointer.flex.items-center.justify-center'
const normalBtnClass = '.mobius-shadow--normal.hover_mobius-text--primary'
const selectedBtnClass = '.mobius-shadow--inset.mobius-text--primary'

const makeButtonE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {
    name: '',
    title: '',
    icon: '',
    selected: ''
  }
} = {}) => {
  const { name, icon, title, selected } = config
  return div(
    `${selector}${baseBtnClass}${selected === name ? selectedBtnClass : normalBtnClass}`,
    hardDeepMerge(props, { dataset: { unique } }),
    [
      span(`.mobius-icon${icon ? '.mobius-icon-' + icon : ''}.mobius-text--2xl`),
      title
    ]
  )
}

export { makeButtonE }
