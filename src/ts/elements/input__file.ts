import { createElementMaker } from '../helpers/index'

export const makeFileInputE = createElementMaker({
  marks: {},
  styles: {
    type: 'FileInput',
    name: '',
    label: '',
    accept: '',
    multiple: false
  },
  actuations: {
    changeHandler: e => {
      const files = e.target.files
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = e => {
          console.warn('[FileInput element changeHandler example]:', e.target.result)
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
