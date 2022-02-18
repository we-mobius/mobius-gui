import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'
import { makeFormItemLayoutE } from './layout__form-item'
import { makeDatePickerE } from './date-picker'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'
import type { DatePickerValue } from './date-picker'

export type DateInputElementType = 'DateInput'
export interface DateInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: DateInputElementType
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
    min?: string
    max?: string
    step?: number | 'any'
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: DateInputValue) => void
  }
}
export type DateInputValue = DatePickerValue

export const makeDateInputE = createElementMaker<DateInputElementOptions>({
  marks: {},
  styles: {
    type: 'DateInput',
    name: '',
    classes: '',
    direction: 'horizontal',
    label: '',
    title: '',
    description: '',
    information: '',
    instructions: [],
    value: '1970-01-01',
    min: '',
    max: '',
    step: 'any'
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
      const { name, label, title, description, information, instructions, value } = styles
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
          input: makeDatePickerE({
            styles: { name, title, value },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    } else {
      const { name, label, title, description, information, instructions, value } = styles
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
          input: makeDatePickerE({
            styles: { name, title, value },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    }
  }
})
