import { makeElementMaker } from '../helpers/index'

export const makeInputE = makeElementMaker({
  marks: {},
  styles: {
    type: 'Input',
    inputType: ''
  },
  actuations: {
    changeHandler: e => { console.warn('LOG', e) }
  },
  configs: {},
  handler: (view) => {
    return view`
      <div>
        <div>${'name'}</div>
        <input type=${'inputType'} @change=${'changeHandler'} />
      </div>
    `
  }
})
