import { createElementMaker } from '../helpers/element'

import type { ElementOptions } from '../helpers/element'

export interface TipElementOptions extends ElementOptions {
}

/**
 * @todo TODO: complete implementation
 */
export const makeTipE = createElementMaker<TipElementOptions>({
  marks: {},
  styles: {},
  actuations: {},
  configs: {},
  prepareTemplate: (view, { utils: { html } }) => {
    return html`
      <div class='mobius-padding--base'>
        <div class='mobius-padding--small mobius-rounded--full mobius-bg--base mobius-text--red mobius-text--small mobius-cursor--pointer'>
          <span class='mobius-icon matrix-icon-error mobius-padding-right--xs'></span>
          这是一条提示信息
        </div>
      </div>
    `
  }
})
