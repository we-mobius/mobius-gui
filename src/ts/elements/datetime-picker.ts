import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export type DateTimePickerElementType = 'DateTimePicker'
export interface DateTimePickerElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: DateTimePickerElementType
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
    valueChangeHandler?: (value: DateTimePickerValue) => void
  }
}
export interface DateTimePickerValue {
  name: string
  label: string
  value: string
  valueAsString: string
  valueAsDate: Date
  valueAsNumber: number
}

/**
 * @todo TODO: add more date format to `DateTimePickerValue`.
 */
export const makeDateTimePickerE = createElementMaker<DateTimePickerElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'DateTimePicker',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
    value: '1970-01-01T00:00',
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

    const elementId = id !== '' ? id : makeUniqueString('mobius-datetime-picker')
    const inputId = `${elementId}__input`

    /**
     * datetime-local type of input element's `input` and `change` event are not act like date type of input element.
     */
    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value, valueAsNumber } = event.target
      inputHandler(event)
      valueChangeHandler({ name, label, value, valueAsString: value, valueAsDate: new Date(value), valueAsNumber })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="datetime-local"
          name="${name}" value="${value}" min="${min}" max="${max}" step="${step}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
