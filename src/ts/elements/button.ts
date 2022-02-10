import { createElementMaker, toClassString } from '../helpers/index'

import type { EventHandler, ClassUnion } from '../libs/mobius-utils'
import type { ElementOptions } from '../helpers/index'

export type ButtonElementType = 'Button'
export interface ButtonElementOptions extends ElementOptions {
  styles?: {
    classes?: ClassUnion
    type?: ButtonElementType
    name?: string
    label?: string
    title?: string
    value?: any
    content?: any
  }
  actuations?: {
    clickHandler?: EventHandler<HTMLDivElement>
  }
}

/**
 * @param styles.classes Classes of button wrapper.
 * @param styles.type Constraint for the role form-group member.
 * @param styles.name Button name.
 * @param styles.label Button label.
 * @param styles.title Button title.
 * @param styles.value Button value.
 * @param styles.content Content of button, default to string 'This is a button'.
 * @param actuations.clickHandler Button click handler.
 */
export const makeButtonE = createElementMaker<ButtonElementOptions>({
  marks: {},
  styles: {
    classes: '',
    type: 'Button',
    name: '',
    label: '',
    title: '',
    value: '',
    content: 'This is a button'
  },
  actuations: {
    clickHandler: event => event
  },
  configs: {},
  prepareTemplate: (view, { styles }) => {
    const { classes } = styles
    const classesString = toClassString(classes)

    return view`
      <div
        role="button" name=${'name'} class="mobius-cursor--pointer ${classesString}"
        title=${'title'} @click=${'clickHandler'} data-label=${'label'} data-value=${'value'}
      >
        ${'content'}
      </div>
    `
  }
})
