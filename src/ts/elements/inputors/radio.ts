import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'

export type RadioElementType = 'Radio'
export interface RadioElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: RadioElementType
    name?: string
    /**
     * @default ''
     */
    classes?: ClassUnion
    /**
     * @default ''
     */
    label?: string
    title?: string
    description?: string
    /**
     * @default false
     */
    checked?: boolean
    /**
     * Indicate the order of the Radio and its label.
     * Set to `ltr` means the Radio is on the left of the label.
     * Set to `rtl` means the Radio is on the right of the label.
     *
     * @default 'ltr'
     */
    direction?: 'ltr' | 'rtl'
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#value
     * @default 'on'
     */
    value?: string
  }
  actuations?: {
    /**
     * Use `event.target.checked` to get the status of the radio.
     *
     * @note Setting input's `checked` property by `input.checked = true | false` won't trigger the `changeHandler`,
     *       to watch every value change of the radio, use `valueChangeHandler` instead.
     */
    changeHandler?: EventHandler<HTMLInputElement>
    /**
     * Will be triggered once after the radio element is actually rendered.
     */
    valueChangeHandler?: (value: RadioElementValue) => void
  }
}
export interface RadioElementValue {
  name: string
  label: string
  checked: boolean
  value: string
}

/**
 * @todo TODO: add `description` to view
 */
export const makeRadioE = createElementMaker<RadioElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'Radio',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    checked: false,
    direction: 'ltr',
    value: 'on'
  },
  actuations: {
    changeHandler: event => event,
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { marks, styles, actuations, utils: { ref } }) => {
    const { id } = marks
    const { name, classes, direction } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-Radio')
    const inputId = `${elementId}__input`

    const { changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
      valueChangeHandler({
        name: styles.name,
        label: styles.label,
        checked: event.target.checked,
        value: styles.value
      })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="radio"
          style="appearance: radio;"
          name="${name}"
          @change=${changeHandlerDelegator} ?checked=${'checked'}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
