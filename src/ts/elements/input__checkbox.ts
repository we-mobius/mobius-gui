import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'
import { makeCheckboxE } from './checkbox'
import { makeMiddleColAdaptiveLayoutE } from './layout__middle-col-adaptive'

import type { ClassUnion } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'
import type { CheckboxElementValue } from './checkbox'

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
    classes: '',
    direction: 'horizontal',
    name: '',
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
    const { name, classes, title, information, instructions, options } = styles

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
    const informationPart = html`${information}`
    const inputArea = makeMiddleColAdaptiveLayoutE({
      styles: {
        rootClasses: 'mobius-width--fullpct',
        middle: checkboxGroup,
        right: informationPart
      }
    })
    const instructionsPart = html`<div class="mobius-width--fullpct">${instructions.toString()}</div>`

    const { direction } = styles
    if (direction === 'horizontal') {
      const { label, description } = styles
      const labelPart = html`<div class="mobius-padding-x--r-base" title="${title}">${label}</div>`
      const descriptionPart = html`<div class="mobius-width--fullpct">${description}</div>`
      const wholeView = makeMiddleColAdaptiveLayoutE({
        styles: {
          rootClasses: toClassString(classes),
          left: labelPart,
          middle: html`
            <div class="mobius-width--fullpct mobius-layout__vertical">
              ${[descriptionPart, inputArea, instructionsPart]}
            </div>
          `
        }
      })
      return wholeView
    } else {
      const { label, description } = styles
      const labelPart = html`<div class="" title="${title}">${label}</div>`
      const descriptionPart = html`<div class="mobius-width--fullpct">${description}</div>`
      const wholeView = html`
        <div class="mobius-layout__vertical mobius-flex-items--stretch">
          ${[labelPart, descriptionPart, inputArea, instructionsPart]}
        </div>
      `
      return wholeView
    }
  }
})
