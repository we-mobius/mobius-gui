import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export type MonthPickerElementType = 'MonthPicker'
export interface MonthPickerElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: MonthPickerElementType
    name?: string
    classes?: ClassUnion
    label?: string
    title?: string
    description?: string
    /**
     * Indicate the order of the picker and its label.
     * Set to `ltr` means the picker is on the left of the label.
     * Set to `rtl` means the picker is on the right of the label.
     *
     * @default 'rtl'
     */
    direction?: 'ltr' | 'rtl'
    value?: string
    min?: string
    max?: string
    step?: number | 'any'
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: MonthPickerValue) => void
  }
}
export interface MonthPickerValue {
  name: string
  label: string
  value: string
  valueAsString: string
}

/**
 * @todo TODO: add more date format to `MonthPickerValue`.
 */
export const makeMonthPickerE = createElementMaker<MonthPickerElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'MonthPicker',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
    value: '1970-01',
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
  prepareTemplate: (view, { marks, styles, actuations, utils }) => {
    const { id } = marks
    const { name, label, classes, direction, value, min, max, step } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-month-picker')
    const inputId = `${elementId}__input`

    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value } = event.target
      changeHandler(event)
      valueChangeHandler({ name, label, value, valueAsString: value })
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      inputHandler(event)
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="month"
          name="${name}" value="${value}" min="${min}" max="${max}" step="${step}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
