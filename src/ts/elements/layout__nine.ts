import {
  makeElementMaker
} from '../helpers/element'
import {
  nothing
} from '../libs/lit-html'

// TODO: 支持设置 mask
export const makeNineLayoutE = makeElementMaker({
  marks: {},
  styles: {
    rootClasses: '',
    isShow: false,
    isHollow: false,
    tl: nothing,
    tc: nothing,
    tr: nothing,
    cl: nothing,
    cc: nothing,
    cr: nothing,
    bl: nothing,
    bc: nothing,
    br: nothing
  },
  actuations: {},
  configs: {},
  handler: (view, { marks, styles, actuations, configs, utils: { html } }) => {
    const { isShow, isHollow } = styles

    return view`
      <div class='${'rootClasses'} mobius-layout__nine ${isHollow ? 'mobius-layout__nine--hollow' : 'mobius-size--fullpct'} ${isShow ? 'mobius-display--block' : 'mobius-display--none'}' >
        <div class='mobius-layout__nine--tl'>${'tl'}</div>
        <div class='mobius-layout__nine--tc'>${'tc'}</div>
        <div class='mobius-layout__nine--tr'>${'tr'}</div>
        <div class='mobius-layout__nine--cl'>${'cl'}</div>
        <div class='mobius-layout__nine--cc'>${'cc'}</div>
        <div class='mobius-layout__nine--cr'>${'cr'}</div>
        <div class='mobius-layout__nine--bl'>${'bl'}</div>
        <div class='mobius-layout__nine--bc'>${'bc'}</div>
        <div class='mobius-layout__nine--br'>${'br'}</div>
      </div>
    `
  }
})
