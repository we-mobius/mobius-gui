import { adaptMultiPlatform } from './libs/mobius.js'
import * as MobiusUI from './index.js'

adaptMultiPlatform({
  webFn: () => {
    window.MobiusUI = MobiusUI
  },
  wxminaFn: () => {
    // eslint-disable-next-line no-undef
    wx.MobiusUI = MobiusUI
  },
  defaultFn: () => {
    if (this) {
      this.MobiusUI = MobiusUI
    }
  }
})
