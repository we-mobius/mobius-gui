import { toClassString, makeUniqueString, debounceS } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'

export type LongTextInputorElementType = 'LongTextInputor'
export interface LongTextInputorElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: LongTextInputorElementType
    classes?: ClassUnion
    name?: string
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
    value?: string
    rows?: number
    minlength?: number
    maxlength?: number
    placeholder?: string
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: LongTextInputorValue) => void
  }
}
export interface LongTextInputorValue {
  name: string
  label: string
  value: string
  valueAsString: string
}

/**
 * @todo TODO: add more date format to `LongTextInputorValue`.
 */
export const makeLongTextInputorE = createElementMaker<LongTextInputorElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'LongTextInputor',
    classes: '',
    name: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
    value: '',
    rows: 3,
    minlength: 0,
    maxlength: 999,
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
    const { name, label, classes, direction, value, rows, minlength, maxlength, placeholder } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-longtext-inputor')
    const inputId = `${elementId}__input`

    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const debouncedValueChangeHandler = debounceS(valueChangeHandler, 200)
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value } = event.target
      inputHandler(event)
      debouncedValueChangeHandler({ name, label, value, valueAsString: value })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <textarea
          id="${inputId}" class="mobius-width--fullpct" rows="${rows}"
          name="${name}" minlength="${minlength}" maxlength="${maxlength}" placeholder="${placeholder}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
        >${value}</textarea>
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
