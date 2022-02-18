import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export type ColorPickerElementType = 'ColorPicker'
export interface ColorPickerElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: ColorPickerElementType
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
  }
  actuations?: {
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    valueChangeHandler?: (value: ColorPickerValue) => void
  }
}
export interface ColorPickerValue {
  name: string
  label: string
  value: string
  valueAsHEX: string
}

/**
 * @todo TODO: add more color format to `ColorPickerValue`.
 */
export const makeColorPickerE = createElementMaker<ColorPickerElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'ColorPicker',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    direction: 'rtl',
    value: '#000000'
  },
  actuations: {
    inputHandler: event => event,
    changeHandler: event => event,
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { marks, styles, actuations, utils }) => {
    const { id } = marks
    const { name, label, classes, direction, value } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-color-picker')
    const inputId = `${elementId}__input`

    const { inputHandler, changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value } = event.target
      changeHandler(event)
      valueChangeHandler({ name, label, value, valueAsHEX: value })
    }
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      const { value } = event.target
      inputHandler(event)
      valueChangeHandler({ name, label, value, valueAsHEX: value })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="color"
          name="${name}" value="${value}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
