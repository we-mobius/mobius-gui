import { html, nothing } from 'lit-html'
import { iif, argPlaceholder } from '../libs/mobius-utils.js'

const iifNothing = iif(argPlaceholder, argPlaceholder, nothing)

const makeTop = top => iifNothing(top, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${top}
  </div>
`)

const makeMiddle = middle => iifNothing(middle, html`
  <div class="mobius-display--flex mobius-position--relative mobius-flex-grow--1">
    ${middle}
  </div>
`)

const makeBottom = bottom => iifNothing(bottom, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${bottom}
  </div>
`)

export const makeMiddleRowAdaptiveLayoutLE = elementOptions => {
  const { classes = '', children = {}, config = {} } = elementOptions
  const { top, middle, bottom } = children

  return html`
    <div class="mobius-display--flex mobius-layout__vertical mobius-flex-wrap--nowrap ${classes}">
      ${makeTop(top)}
      ${makeMiddle(middle)}
      ${makeBottom(bottom)}
    </div>
  `
}
