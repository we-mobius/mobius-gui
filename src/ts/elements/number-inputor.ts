import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export type NumberInputorElementType = 'NumberInputor'
export interface NumberInputorElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: NumberInputorElementType
    name?: string
    classes?: ClassUnion
    label?: string
    title?: string
    description?: string
    /**
     * Indicate the order of the inputor and its label.
     * Set to `ltr` means the inputor is on the left of the label.
     * Set to `rtl` means the inputor is on the right of the label.
     *
     * @default 'rtl'
     */
    direction?: 'ltr' | 'rtl'
    value?: number
    min?: number
    max?: number
    step?: number
    placeholder?: string
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: NumberInputorValue) => void
  }
}
export interface NumberInputorValue {
  name: string
  label: string
  value: string
  valueAsString: string
  valueAsNumber: number
}

/**
 * @todo TODO: add more date format to `NumberInputorValue`.
 */
export const makeNumberInputorE = createElementMaker<NumberInputorElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'NumberInputor',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
    value: 0,
    min: -Infinity,
    max: Infinity,
    step: 1,
    placeholder: ''
  },
  actuations: {
    inputHandler: event => event,
    changeHandler: event => event,
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { marks, styles, actuations, utils }) => {
    const { id } = marks
    const { name, label, classes, direction, value, min, max, step, placeholder } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-number-inputor')
    const inputId = `${elementId}__input`

    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value, valueAsNumber } = event.target
      inputHandler(event)
      valueChangeHandler({ name, label, value, valueAsString: value, valueAsNumber })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="number"
          name="${name}" value="${value}" min="${min}" max="${max}" step="${step}" placeholder="${placeholder}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
