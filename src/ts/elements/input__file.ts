import { isNull } from '../libs/mobius-utils'
import { createElementMaker } from '../helpers/index'

import type { ElementOptions } from '../helpers/index'

export type FileInputElementType = 'FileInput'
export interface FileInputElementOptions extends ElementOptions {
  styles?: {
    type?: FileInputElementType
    name?: string
    label?: string
    accept?: string
    multiple?: boolean
  }
  actuations?: {
    changeHandler?: (event: Event) => void
  }
}

/**
 *
 */
export const makeFileInputE = createElementMaker<FileInputElementOptions>({
  marks: {},
  styles: {
    type: 'FileInput',
    name: '',
    label: '',
    accept: '',
    multiple: false
  },
  actuations: {
    changeHandler: (event) => {
      const files = (event.target as HTMLInputElement).files
      if (isNull(files)) return

      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (progressEvent) => {
          console.warn('[FileInput element changeHandler example]:', progressEvent?.target?.result)
        }
        reader.readAsText(file)
      })
    }
  },
  configs: {},
  prepareTemplate: (view) => {
    return view`
      <div>
        <label for=${'name'}>${'label'}</label>
        <input name=${'name'} type='file' accept=${'accept'} multiple=${'multiple'} @change=${'changeHandler'} />
      </div>
    `
  }
})
