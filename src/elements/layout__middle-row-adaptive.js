import { html, nothing } from '../libs/lit-html.js'
import { iif, argPlaceholder } from '../libs/mobius-utils.js'
import { makeElementMaker } from '../helpers/index.js'

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
html``
export const makeMiddleRowAdaptiveLayoutE = makeElementMaker({
  marks: {},
  styles: {},
  actuations: {},
  configs: {},
  handler: (view, { styles }) =>
    view`
      <div class="mobius-display--flex mobius-layout__vertical mobius-flex-wrap--nowrap ${'rootClasses'}">
        ${makeTop(styles.top)}
        ${makeMiddle(styles.middle)}
        ${makeBottom(styles.bottom)}
      </div>
    `
})
