import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'
import { makeMiddleColAdaptiveLayoutE } from './layout__middle-col-adaptive'

import type { ClassUnion } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export interface FormItemLayoutElementOptions extends ElementOptions {
  styles?: {
    classes?: ClassUnion
    direction?: 'horizontal' | 'vertical'
    label?: any
    description?: any
    input?: any
    information?: any
    instructions?: any
  }
}

/**
 * @example
 * ```
 * // horizontal layout
 * ----------------------------------
 * | label |      description       |
 * |       |       input        | @ |
 * |       |      instructions      |
 * ----------------------------------
 * // vertical layout
 * ----------------------------------
 * | label                          |
 * | description                    |
 * |             input          | @ |
 * | instructions                   |
 * ----------------------------------
 * ```
 */
export const makeFormItemLayoutE = createElementMaker<FormItemLayoutElementOptions>({
  marks: {},
  styles: {
    classes: '',
    direction: 'horizontal',
    label: '',
    description: '',
    input: '',
    information: '',
    instructions: ''
  },
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles, utils: { html } }) => {
    const { direction } = styles
    if (direction === 'horizontal') {
      /**
       * ----------------------------------
       * | label |      description       |
       * |       |       input        | @ |
       * |       |      instructions      |
       * ----------------------------------
       */
      const { classes, label, description, input, information, instructions } = styles
      const inputArea = makeMiddleColAdaptiveLayoutE({
        styles: {
          rootClasses: 'mobius-width--fullpct',
          middle: input,
          right: information
        }
      })
      const wholeView = makeMiddleColAdaptiveLayoutE({
        styles: {
          rootClasses: toClassString(classes),
          left: label,
          middle: html`
            <div class="mobius-width--fullpct mobius-layout__vertical mobius-flex-items--stretch">
              ${[description, inputArea, instructions]}
            </div>
          `
        }
      })
      return wholeView
    } else if (direction === 'vertical') {
      /**
       * ----------------------------------
       * | label                          |
       * | description                    |
       * |             input          | @ |
       * | instructions                   |
       * ----------------------------------
       */
      const { label, description, input, information, instructions } = styles
      const inputArea = makeMiddleColAdaptiveLayoutE({
        styles: {
          rootClasses: 'mobius-width--fullpct',
          middle: input,
          right: information
        }
      })
      const wholeView = html`
        <div class="mobius-layout__vertical mobius-flex-items--stretch">
          ${[label, description, inputArea, instructions]}
        </div>
      `
      return wholeView
    } else {
      return html`Unexpected direction of formItemLayoutElement received.`
    }
  }
})
