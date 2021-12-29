import { createElementMaker } from '../helpers/index'

import type { ElementOptions } from '../helpers/index'

export type InputElementType = 'Input'
export interface InputElementOptions extends ElementOptions {
  styles?: {
    type?: InputElementType
    inputType?: string
  }
  actuations?: {
    changeHandler?: (event: Event) => void
  }
}

export const makeInputE = createElementMaker<InputElementOptions>({
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
