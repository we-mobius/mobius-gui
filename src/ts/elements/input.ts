import { createElementMaker } from '../helpers/index'

import type { EventHandler } from '../libs/mobius-utils'
import type { ElementOptions } from '../helpers/index'

export type InputElementType = 'Input'
export interface InputElementOptions extends ElementOptions {
  styles?: {
    type?: InputElementType
    inputType?: string
  }
  actuations?: {
    changeHandler?: EventHandler<HTMLInputElement>
  }
}

export const makeInputE = createElementMaker<InputElementOptions>({
  marks: {},
  styles: {
    type: 'Input',
    inputType: ''
  },
  actuations: {
    changeHandler: event => { console.warn('LOG', event) }
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
