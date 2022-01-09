import { createElementMaker } from '../helpers/index'

import type { EventHandler } from '../libs/mobius-utils'
import type { ElementOptions } from '../helpers/index'

export type ButtonElementType = 'Button'
export interface ButtonElementOptions extends ElementOptions {
  styles?: {
    type?: ButtonElementType
    name?: string
    label: string
  }
  actuations?: {
    clickHandler?: EventHandler<HTMLButtonElement>
  }
}

/**
 * @param styles.type Constraint for the role form-group member.
 * @param styles.name Button name.
 * @param styles.label Button label.
 * @param actuations.clickHandler Button click handler.
 */
export const makeButtonE = createElementMaker<ButtonElementOptions>({
  marks: {},
  styles: {
    type: 'Button',
    name: '',
    label: ''
  },
  actuations: {
    clickHandler: event => event
  },
  configs: {},
  prepareTemplate: (view) => {
    return view`
      <button name=${'name'} @click=${'clickHandler'}>${'label'}</button>
    `
  }
})
