import { createElementMaker } from '../helpers/index'

interface ButtonElementOptions {
  styles?: {
    type?: 'Button'
    name?: string
    label?: string
  }
  actuations?: {
    clickHandler?: (event: Event) => void
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
    clickHandler: (event: Event): Event => event
  },
  configs: {},
  prepareTemplate: (view, { styles, utils: { prefix } }) => {
    return view`
      <button name=${'name'} @click=${'clickHandler'}>${'label'}</button>
    `
  }
})
