import { toClassString, makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'

export type CheckboxElementType = 'Checkbox'
export interface CheckboxElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    type?: CheckboxElementType
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
     * @default false
     */
    indeterminate?: boolean
    /**
     * Indicate the order of the checkbox and its label.
     * Set to `ltr` means the checkbox is on the left of the label.
     * Set to `rtl` means the checkbox is on the right of the label.
     *
     * @default 'ltr'
     */
    direction?: 'ltr' | 'rtl'
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
     * @default 'on'
     */
    value?: string
  }
  actuations?: {
    /**
     * Use `event.target.checked` to get the status of the checkbox.
     *
     * @note Setting input's `checked` property by `input.checked = true | false` won't trigger the `changeHandler`,
     *       to watch every value change of the checkbox, use `valueChangeHandler` instead.
     */
    changeHandler?: EventHandler<HTMLInputElement>
    /**
     * Will be triggered once after the checkbox element is actually rendered.
     */
    valueChangeHandler?: (value: CheckboxElementValue) => void
  }
}
export interface CheckboxElementValue {
  name: string
  label: string
  checked: boolean
  indeterminate: boolean
  value: string
}

/**
 * @todo TODO: add `description` to view
 */
export const makeCheckboxE = createElementMaker<CheckboxElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'Checkbox',
    name: '',
    classes: '',
    label: '',
    title: '',
    description: '',
    checked: false,
    indeterminate: false,
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

    const elementId = id !== '' ? id : makeUniqueString('mobius-checkbox')
    const inputId = `${elementId}__input`

    const { indeterminate } = styles
    const initialize = (input: Element | undefined): void => {
      if (input === undefined) return
      // set `indeterminate` state
      // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#:~:text=Note%3A%20No%20browser%20currently%20supports%C2%A0indeterminate%C2%A0as%20an%20attribute.%20It%20must%20be%20set%20via%20JavaScript.%20See%20Indeterminate%20state%20checkboxes%20for%20details.
      (input as HTMLInputElement).indeterminate = indeterminate
    }

    const { changeHandler, valueChangeHandler } = actuations
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
      valueChangeHandler({
        name: styles.name,
        label: styles.label,
        checked: event.target.checked,
        indeterminate: (event.target as HTMLInputElement).indeterminate,
        value: styles.value
      })
    }

    return view`
      <div id="${elementId}" class="mobius-layout__horizontal ${toClassString(classes)}" title="${'title'}">
        <label for="${inputId}" style="display: ${direction === 'rtl' ? 'unset' : 'none'};">${'label'}</label>
        <input
          id="${inputId}" type="checkbox"
          style="appearance: checkbox;"
          name="${name}"
          @change=${changeHandlerDelegator} ?checked=${'checked'} ${ref(initialize)}
        >
        <label for="${inputId}" style="display: ${direction === 'ltr' ? 'unset' : 'none'};">${'label'}</label>
      </div>
    `
  }
})
