import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'

export type URLInputorElementType = 'URLInputor'
export interface URLInputorElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: URLInputorElementType
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
    value?: string
    minlength?: number
    maxlength?: number
    placeholder?: string
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: URLInputorValue) => void
  }
}
export interface URLInputorValue {
  name: string
  label: string
  value: string
  valueAsString: string
}

/**
 * @todo TODO: add more date format to `URLInputorValue`.
 */
export const makeURLInputorE = createElementMaker<URLInputorElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'URLInputor',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
    value: '',
    minlength: 0,
    maxlength: 999,
    placeholder: 'https://example.com'
  },
  actuations: {
    inputHandler: event => event,
    changeHandler: event => event,
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { marks, styles, actuations, utils }) => {
    const { id } = marks
    const { name, label, classes, direction, value, minlength, maxlength, placeholder } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-url-inputor')
    const inputId = `${elementId}__input`

    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value } = event.target
      inputHandler(event)
      valueChangeHandler({ name, label, value, valueAsString: value })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="url" inputmode="url"
          name="${name}" value="${value}" minlength="${minlength}" maxlength="${maxlength}" placeholder="${placeholder}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
