import { iif_, argPlaceholder } from '../libs/mobius-utils'
import { html, nothing } from '../libs/lit-html'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { ElementOptions } from '../helpers/index'

const iifNothing = iif_(argPlaceholder, argPlaceholder, nothing)

const makeLeft = (left: any): TemplateResult | typeof nothing => iifNothing(left, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${left}
  </div>
`)

const makeMiddle = (middle: any): TemplateResult | typeof nothing => iifNothing(middle, html`
  <div class="mobius-display--flex mobius-position--relative mobius-flex-grow--1">
    ${middle}
  </div>
`)

const makeRight = (right: any): TemplateResult | typeof nothing => iifNothing(right, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${right}
  </div>
`)

export interface MiddleColAdaptiveLayoutElementOptions extends ElementOptions {
  styles?: {
    rootClasses?: ClassUnion
    left?: any
    middle?: any
    right?: any
  }
}

/**
 * @param styles.left - Left element.
 * @param styles.middle - Middle element.
 * @param styles.right - Right element.
 */
export const makeMiddleColAdaptiveLayoutE = createElementMaker<MiddleColAdaptiveLayoutElementOptions>({
  marks: {},
  styles: {
    rootClasses: '',
    left: nothing,
    middle: nothing,
    right: nothing
  },
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles }) => {
    const { left, middle, right } = styles

    return view`
      <div class="mobius-display--flex mobius-layout__horizontal mobius-flex-items--stretch mobius-flex-wrap--nowrap ${'"rootClasses"'}">
        ${makeLeft(left)}
        ${makeMiddle(middle)}
        ${makeRight(right)}
      </div>
    `
  }
})
