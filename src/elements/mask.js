import { makeElementMaker } from '../helpers/index.js'

export const makeMaskE = makeElementMaker({
  marks: {},
  styles: {
    mask: '',
    container: '',
    isShow: false,
    content: ''
  },
  actuations: {
    clickHandler: e => e
  },
  configs: {},
  handler: (view, { styles, utils: { prefix } }) => {
    return view`
      <div
        class=${prefix('size--fullabs position--relative layout__horizontal flex-justify--center flex-items--center')}
        style='display: ${styles.isShow ? 'flex' : 'none'}'
      >
        <div
          class=${prefix('size--fullabs bg--third visible--medium ' + styles.mask)}
          @click=${'clickHandler'}
        ></div>
        <div
          class=${prefix('border--all border--primary rounded--base padding--base position--z-toppest overflow--hidden ' + styles.container)}
        >
          ${styles.content}
        </div>
      </div>
    `
  }
})
