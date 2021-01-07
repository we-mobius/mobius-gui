import { html, nothing } from 'lit-html'
import { iif, argPlaceholder } from '../libs/mobius-utils.js'

const iifNothing = iif(argPlaceholder, argPlaceholder, nothing)

const makeLeft = left => iifNothing(left, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${left}
  </div>
`)

const makeMiddle = middle => iifNothing(middle, html`
  <div class="mobius-display--flex mobius-position--relative mobius-flex-grow--1">
    ${middle}
  </div>
`)

const makeRight = right => iifNothing(right, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${right}
  </div>
`)

export const makeMiddleColAdaptiveLayoutLE = elementOptions => {
  const { classes = '', children = {}, config = {} } = elementOptions
  const { left, middle, right } = children

  return html`
    <div class="mobius-display--flex mobius-layout__horizontal mobius-flex-items--stretch mobius-flex-wrap--nowrap ${classes}">
      ${makeLeft(left)}
      ${makeMiddle(middle)}
      ${makeRight(right)}
    </div>
  `
}
