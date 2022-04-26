import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'
import { makeFormItemLayoutE } from '../layout__form-item'
import { makeLongTextInputorE } from '../longtext-inputor'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'
import type { LongTextInputorValue } from '../longtext-inputor'

export type LongTextInputElementType = 'LongTextInput'
export interface LongTextInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: LongTextInputElementType
    /**
     * FormGroup member constraint.
     */
    name?: string
    classes?: ClassUnion
    direction?: 'horizontal' | 'vertical'
    label?: string
    title?: string
    description?: string
    information?: string
    instructions?: any[]
    value?: string
    rows?: number
    minlength?: number
    maxlength?: number
    placeholder?: string
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: LongTextInputValue) => void
  }
}
export type LongTextInputValue = LongTextInputorValue

export const makeLongTextInputE = createElementMaker<LongTextInputElementOptions>({
  marks: {},
  styles: {
    type: 'LongTextInput',
    name: '',
    classes: '',
    direction: 'horizontal',
    label: '',
    title: '',
    description: '',
    information: '',
    instructions: [],
    value: '',
    rows: 3,
    minlength: 0,
    maxlength: 999,
    placeholder: ''
  },
  actuations: {
    inputHandler: event => event,
    changeHandler: event => event,
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations, utils: { html } }) => {
    const { classes, direction } = styles

    if (direction === 'horizontal') {
      const { name, label, title, description, information, instructions, value, rows, minlength, maxlength, placeholder } = styles
      const { inputHandler, changeHandler, valueChangeHandler } = actuations
      const labelPart = html`<div class="mobius-padding-x--r-base" title="${title}">${label}</div>`
      const descriptionPart = html`<div class="mobius-width--fullpct">${description}</div>`
      const informationPart = html`${information}`
      const instructionsPart = html`<div class="mobius-width--fullpct">${instructions.toString()}</div>`
      return makeFormItemLayoutE({
        styles: {
          classes: classes,
          direction: 'horizontal',
          label: labelPart,
          description: descriptionPart,
          input: makeLongTextInputorE({
            styles: { classes: 'mobius-width--fullpct', name, title, value, rows, minlength, maxlength, placeholder },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    } else {
      const { name, label, title, description, information, instructions, value, rows, minlength, maxlength, placeholder } = styles
      const { inputHandler, changeHandler, valueChangeHandler } = actuations
      const labelPart = html`<div class="" title="${title}">${label}</div>`
      const descriptionPart = html`<div class="mobius-width--fullpct">${description}</div>`
      const informationPart = html`${information}`
      const instructionsPart = html`<div class="mobius-width--fullpct">${instructions.toString()}</div>`
      return makeFormItemLayoutE({
        styles: {
          classes: classes,
          direction: 'vertical',
          label: labelPart,
          description: descriptionPart,
          input: makeLongTextInputorE({
            styles: { classes: 'mobius-width--fullpct', name, title, value, rows, minlength, maxlength, placeholder },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    }
  }
})
