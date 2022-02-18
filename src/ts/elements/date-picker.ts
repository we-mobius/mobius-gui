import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export type DatePickerElementType = 'DatePicker'
export interface DatePickerElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: DatePickerElementType
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
    valueChangeHandler?: (value: DatePickerValue) => void
  }
}
export interface DatePickerValue {
  name: string
  label: string
  value: string
  valueAsString: string
  valueAsDate: Date | null
  valueAsNumber: number
}

/**
 * @todo TODO: add more date format to `DatePickerValue`.
 */
export const makeDatePickerE = createElementMaker<DatePickerElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'DatePicker',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
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
  prepareTemplate: (view, { marks, styles, actuations, utils }) => {
    const { id } = marks
    const { name, label, classes, direction, value, min, max, step } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-date-picker')
    const inputId = `${elementId}__input`

    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value, valueAsDate, valueAsNumber } = event.target
      changeHandler(event)
      valueChangeHandler({ name, label, value, valueAsString: value, valueAsDate, valueAsNumber })
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      inputHandler(event)
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="date" value="${value}" min="${min}" max="${max}" step="${step}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator} ?checked=${'checked'}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
