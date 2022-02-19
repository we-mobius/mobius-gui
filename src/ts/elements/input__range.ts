import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'
import { makeFormItemLayoutE } from './layout__form-item'
import { makeRangeSliderE } from './range-slider'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'
import type { RangeSliderValue } from './range-slider'

export type RangeInputElementType = 'RangeInput'
export interface RangeInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: RangeInputElementType
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
    value?: number
    min?: number
    max?: number
    step?: number
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: RangeInputValue) => void
  }
}
export type RangeInputValue = RangeSliderValue

export const makeRangeInputE = createElementMaker<RangeInputElementOptions>({
  marks: {},
  styles: {
    type: 'RangeInput',
    name: '',
    classes: '',
    direction: 'horizontal',
    label: '',
    title: '',
    description: '',
    information: '',
    instructions: [],
    value: 0,
    min: -Infinity,
    max: Infinity,
    step: 1
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
      const { name, label, title, description, information, instructions, value, min, max, step } = styles
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
          input: makeRangeSliderE({
            styles: { name, title, value, min, max, step },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    } else {
      const { name, label, title, description, information, instructions, value, min, max, step } = styles
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
          input: makeRangeSliderE({
            styles: { name, title, value, min, max, step },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    }
  }
})
