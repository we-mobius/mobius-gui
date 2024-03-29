import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'
import { makeCheckboxE } from '../inputors/checkbox'
import { makeFormItemLayoutE } from '../layout__form-item'

import type { ClassUnion } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'
import type { CheckboxElementValue } from '../inputors/checkbox'

export type CheckboxInputElementType = 'CheckboxInput'
export interface CheckboxInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: CheckboxInputElementType
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
    options?: Array<{ label: string, checked?: boolean, indeterminate?: boolean, value?: string }>
  }
  actuations?: {
    valueChangeHandler: (value: CheckboxInputElementValue) => void
  }
}
export type CheckboxInputElementValue = CheckboxElementValue[]

export const makeCheckboxInputE = createElementMaker<CheckboxInputElementOptions>({
  marks: {},
  styles: {
    type: 'CheckboxInput',
    name: '',
    classes: '',
    direction: 'horizontal',
    label: '',
    title: '',
    description: '',
    information: '',
    instructions: [],
    options: []
  },
  actuations: {
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations, utils: { html } }) => {
    const { name, classes, title, options } = styles

    const preparedOptions = options.map((option, index) => {
      return { ...option, name, id: index.toString() }
    })

    const { valueChangeHandler } = actuations
    const checkboxsValues = preparedOptions.map<CheckboxElementValue>(({ name, label, checked, indeterminate, value }) => ({
      name, label, checked: checked ?? false, indeterminate: indeterminate ?? false, value: value ?? 'on'
    }))
    const valueChangeHandlerDelegator = (id: number) => (value: CheckboxElementValue): void => {
      checkboxsValues[id] = { ...checkboxsValues[id], ...value }
      valueChangeHandler(checkboxsValues)
    }

    const checkboxs = preparedOptions.map((option, index) => {
      return makeCheckboxE({
        styles: option,
        actuations: {
          valueChangeHandler: valueChangeHandlerDelegator(index)
        }
      })
    })
    const checkboxGroup = html`
      <div class="mobius-width--fullpct mobius-layout__horizontal">
        ${checkboxs}
      </div>
    `

    const { direction } = styles
    if (direction === 'horizontal') {
      const { label, description, information, instructions } = styles
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
          input: checkboxGroup,
          information: informationPart,
          instructions: instructionsPart
        }
      })
    } else {
      const { label, description, information, instructions } = styles
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
          input: checkboxGroup,
          information: informationPart,
          instructions: instructionsPart
        }
      })
    }
  }
})
