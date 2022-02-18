import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'
import { makeFormItemLayoutE } from './layout__form-item'
import { makeColorPickerE } from './color-picker'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'
import type { ColorPickerValue } from './color-picker'

export type ColorInputElementType = 'ColorInput'
export interface ColorInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: ColorInputElementType
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
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: ColorInputValue) => void
  }
}
export type ColorInputValue = ColorPickerValue

export const makeColorInputE = createElementMaker<ColorInputElementOptions>({
  marks: {},
  styles: {
    type: 'ColorInput',
    name: '',
    classes: '',
    direction: 'horizontal',
    label: '',
    title: '',
    description: '',
    information: '',
    instructions: [],
    value: '#000000'
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
          input: makeColorPickerE({
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
          input: makeColorPickerE({
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
