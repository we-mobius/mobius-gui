import { createElementMaker } from '../helpers/index'

export const makeInputE = createElementMaker({
  marks: {},
  styles: {
    type: 'Input',
    inputType: ''
  },
  actuations: {
    changeHandler: e => { console.warn('LOG', e) }
  },
  configs: {},
  prepareTemplate: (view) => {
    return view`
      <div>
        <div>${'name'}</div>
        <input type=${'inputType'} @change=${'changeHandler'} />
      </div>
    `
  }
})
