import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'
import { makeRadioE } from '../radio'
import { makeFormItemLayoutE } from '../layout__form-item'

import type { ClassUnion } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'
import type { RadioElementValue } from '../radio'

export type RadioInputElementType = 'RadioInput'
export interface RadioInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: RadioInputElementType
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
    options?: Array<{ label: string, checked?: boolean, value?: string }>
  }
  actuations?: {
    valueChangeHandler: (value: RadioInputElementValue) => void
  }
}
export type RadioInputElementValue = RadioElementValue[]

export const makeRadioInputE = createElementMaker<RadioInputElementOptions>({
  marks: {},
  styles: {
    type: 'RadioInput',
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
    const radiosValues = preparedOptions.map<RadioElementValue>(({ name, label, checked, value }) => ({
      name, label, checked: checked ?? false, value: value ?? 'on'
    }))
    const valueChangeHandlerDelegator = (id: number) => (value: RadioElementValue): void => {
      // 当其中某个 radio 被选中时，其他 radio 取消选中
      // 实现的逻辑为先将所有 radio 取消选中，然后将被点击的 radio 选中
      radiosValues.forEach((radioValue, index) => {
        radioValue.checked = false
      })
      radiosValues[id].checked = true
      valueChangeHandler(radiosValues)
    }

    const radios = preparedOptions.map((option, index) => {
      return makeRadioE({
        styles: option,
        actuations: {
          valueChangeHandler: valueChangeHandlerDelegator(index)
        }
      })
    })
    const radioGroup = html`
      <div class="mobius-width--fullpct mobius-layout__horizontal">
        ${radios}
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
          input: radioGroup,
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
          input: radioGroup,
          information: informationPart,
          instructions: instructionsPart
        }
      })
    }
  }
})
