import { makeElementMaker } from '../helpers/index.js'

export const makeButtonE = makeElementMaker({
  marks: {},
  styles: {
    type: 'Button',
    name: '',
    label: ''
  },
  actuations: {
    clickHandler: e => e
  },
  configs: {},
  handler: (view, { styles, utils: { prefix } }) => {
    return view`
      <button name=${'name'} @click=${'clickHandler'}>${'label'}</button>
    `
  }
})
