import { html, nothing } from '../libs/lit-html'
import { iif, argPlaceholder } from '../libs/mobius-utils'
import { createElementMaker } from '../helpers/index'

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

export const makeMiddleColAdaptiveLayoutE = createElementMaker({
  marks: {},
  styles: {},
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles }) =>
    view`
      <div class="mobius-display--flex mobius-layout__horizontal mobius-flex-items--stretch mobius-flex-wrap--nowrap ${'rootClasses'}">
        ${makeLeft(styles.left)}
        ${makeMiddle(styles.middle)}
        ${makeRight(styles.right)}
      </div>
    `
})
