import { iif_, argPlaceholder } from '../libs/mobius-utils'
import { html, nothing } from '../libs/lit-html'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { ElementOptions } from '../helpers/index'

const iifNothing = iif_(argPlaceholder, argPlaceholder, nothing)

const makeTop = (top: any): TemplateResult | typeof nothing => iifNothing(top, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${top}
  </div>
`)

const makeMiddle = (middle: any): TemplateResult | typeof nothing => iifNothing(middle, html`
  <div class="mobius-display--flex mobius-position--relative mobius-flex-grow--1">
    ${middle}
  </div>
`)

const makeBottom = (bottom: any): TemplateResult | typeof nothing => iifNothing(bottom, html`
  <div class="mobius-display--flex mobius-flex-shrink--0">
    ${bottom}
  </div>
`)

export interface MiddleRowAdaptiveLayoutElementOptions extends ElementOptions {
  styles?: {
    rootClasses?: ClassUnion
    top?: any
    middle?: any
    bottom?: any
  }
}

/**
 * @param styles.top - Top element.
 * @param styles.middle - Middle element.
 * @param styles.bottom - Bottom element.
 */
export const makeMiddleRowAdaptiveLayoutE = createElementMaker<MiddleRowAdaptiveLayoutElementOptions>({
  marks: {},
  styles: {
    rootClasses: '',
    top: nothing,
    middle: nothing,
    bottom: nothing
  },
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles }) => {
    const { top, middle, bottom } = styles

    return view`
      <div class="mobius-display--flex mobius-layout__vertical mobius-flex-items--stretch mobius-flex-wrap--nowrap ${'"rootClasses"'}">
        ${makeTop(top)}
        ${makeMiddle(middle)}
        ${makeBottom(bottom)}
      </div>
    `
  }
})
