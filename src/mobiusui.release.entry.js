import { adaptMultiPlatform } from './libs/mobius.js'
import * as MobiusUI from './index.js'
import * as CycleDOM from '@cycle/dom'

adaptMultiPlatform({
  webFn: () => {
    window.MobiusUI = MobiusUI
    window.CycleDOM = CycleDOM
  },
  wxminaFn: () => {
    // eslint-disable-next-line no-undef
    wx.MobiusUI = MobiusUI
    // eslint-disable-next-line no-undef
    wx.CycleDOM = CycleDOM
  },
  defaultFn: () => {
    if (this) {
      this.MobiusUI = MobiusUI
      this.CycleDOM = CycleDOM
    }
  }
})
