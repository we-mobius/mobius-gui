import { isString, isObject } from '../libs/mobius.js'

const isElementOptions = options => Object.prototype.hasOwnProperty.call(options, 'selector')
const isVNode = options => Object.prototype.hasOwnProperty.call(options, 'sel') && Object.prototype.hasOwnProperty.call(options, 'elm')

const curry = (fn, ...args) => {
  if (args.length >= fn.length) {
    return fn(...args)
  } else {
    return (...args2) => curry(fn, ...args, ...args2)
  }
}
const compose = (...fns) => fns.reverse().reduce((g, f) => (...args) => f(g(...args)), fns.shift())

const addSelector = curry((selector, options) => {
  if (isString(options)) {
    return options + selector
  } else {
    if (isElementOptions(options)) {
      options.selector += selector
    } else if (isVNode(options)) {
      options.sel += selector
    } else if (isObject(options)) {
      options.selector = selector
    }
    return options
  }
})
const makeStylizer = extraFn => options => extraFn(options)

const withBorderBox = makeStylizer(addSelector('.mobius-box--border'))
const withContentBox = makeStylizer(addSelector('.mobius-box--content'))

const withFullPctWidth = makeStylizer(addSelector('.mobius-width--100'))
const withFullPctHeight = makeStylizer(addSelector('.mobius-height--100'))
const withFullPct = makeStylizer(addSelector('.mobius-size--fullpct'))
const withFullViewWidth = makeStylizer(addSelector('.mobius-width--100vw'))
const withFullViewHeight = makeStylizer(addSelector('.mobius-height--100vh'))
const withFullView = makeStylizer(addSelector('.mobius-size--fullview'))
const withFullAbsWidth = makeStylizer(addSelector('.mobius-size--fullwidthabs'))
const withFullAbsHeight = makeStylizer(addSelector('.mobius-size--fullheightabs'))
const withFullAbs = makeStylizer(addSelector('.mobius-size--fullabs'))

const withXScroll = makeStylizer(addSelector('.mobius-scroll--x'))
const withYScroll = makeStylizer(addSelector('.mobius-scroll--y'))
const withAllScroll = makeStylizer(addSelector('.mobius-scroll--all'))
const withScrollbarHidden = makeStylizer(addSelector('.mobius-scrollbar--hidden'))

const withPositionRelative = makeStylizer(addSelector('.mobius-position--relative'))
const withPositionAbsolute = makeStylizer(addSelector('.mobius-position--absolute'))
const withPositionFixed = makeStylizer(addSelector('.mobius-position--fixed'))
const withPositionSticky = makeStylizer(addSelector('.mobius-position--sticky'))

const withSelectAuto = makeStylizer(addSelector('.mobius-select--auto'))
const withSelectNone = makeStylizer(addSelector('.mobius-select--none'))
const withSelectAll = makeStylizer(addSelector('.mobius-select--all'))
const withSelectText = makeStylizer(addSelector('.mobius-select--text'))
const withSelectContain = makeStylizer(addSelector('.mobius-select--contain'))

const withCursorPointer = makeStylizer(addSelector('.mobius-cursor--pointer'))

const withTransitionAll = makeStylizer(addSelector('.mobius-transition--all'))

const asFlexContainer = makeStylizer(addSelector('.mobius-display--flex'))

const withPresetHorizontal = makeStylizer(addSelector('.mobius-layout__horizontal'))
const withPresetVertical = makeStylizer(addSelector('.mobius-layout__vertical'))

const withDirectionRow = makeStylizer(addSelector('.mobius-flex-dir--row'))
const withDirectionRowReverse = makeStylizer(addSelector('.mobius-flex-dir--rowreverse'))
const withDriectionColumn = makeStylizer(addSelector('.mobius-flex-dir--column'))
const withDriectionColumnReverse = makeStylizer(addSelector('.mobius-flex-dir--columnreverse'))

const withWrap = makeStylizer(addSelector('.mobius-flex-wrap--normal'))
const withWrapReverse = makeStylizer(addSelector('.mobius-flex-wrap--reverse'))
const withNoWrap = makeStylizer(addSelector('.mobius-flex-wrap--nowrap'))

const withJustifyStart = makeStylizer(addSelector('.mobius-flex-justify--start'))
const withJustifyCenter = makeStylizer(addSelector('.mobius-flex-justify--center'))
const withJustifyEnd = makeStylizer(addSelector('.mobius-flex-justify--end'))
const withJustifyBetween = makeStylizer(addSelector('.mobius-flex-justify--between'))
const withJustifyAround = makeStylizer(addSelector('.mobius-flex-justify--around'))
const withJustifyEvenly = makeStylizer(addSelector('.mobius-flex-justify--evenly'))

const withItemsStart = makeStylizer(addSelector('.mobius-flex-items--start'))
const withItemsCenter = makeStylizer(addSelector('.mobius-flex-items--center'))
const withItemsEnd = makeStylizer(addSelector('.mobius-flex-items--end'))
const withItemsStretch = makeStylizer(addSelector('.mobius-flex-items--stretch'))
const withItemsBaseline = makeStylizer(addSelector('.mobius-flex-items--baseline'))

const asStartItem = makeStylizer(addSelector('.mobius-flex-item--start'))
const asCenterItem = makeStylizer(addSelector('.mobius-flex-item--center'))
const asEndItem = makeStylizer(addSelector('.mobius-flex-item--end'))
const asStretchItem = makeStylizer(addSelector('.mobius-flex-item--stretch'))
const asBaselineItem = makeStylizer(addSelector('.mobius-flex-items--baseline'))

const asGrowItem = makeStylizer(addSelector('.mobius-flex-grow--1'))
const asNoGrowItem = makeStylizer(addSelector('.mobius-flex-grow--0'))
const asShrinkItem = makeStylizer(addSelector('.mobius-flex-shrink--1'))
const asNoShrinkItem = makeStylizer(addSelector('.mobius-flex-shrink--0'))

export {
  compose as equiped,

  withBorderBox, withContentBox,

  withFullPctWidth, withFullPctHeight, withFullPct,
  withFullViewWidth, withFullViewHeight, withFullView,
  withFullAbsWidth, withFullAbsHeight, withFullAbs,

  withXScroll, withYScroll, withAllScroll, withScrollbarHidden,
  withPositionRelative, withPositionAbsolute, withPositionFixed, withPositionSticky,
  withSelectAuto, withSelectNone, withSelectAll, withSelectText, withSelectContain,
  withCursorPointer,
  withTransitionAll,

  asFlexContainer,
  withPresetHorizontal, withPresetVertical,
  withDirectionRow, withDirectionRowReverse, withDriectionColumn, withDriectionColumnReverse,
  withWrap, withWrapReverse, withNoWrap,
  withJustifyStart, withJustifyCenter, withJustifyEnd, withJustifyBetween, withJustifyAround, withJustifyEvenly,
  withItemsStart, withItemsCenter, withItemsEnd, withItemsStretch, withItemsBaseline,
  asStartItem, asCenterItem, asEndItem, asStretchItem, asBaselineItem,
  asGrowItem, asNoGrowItem, asShrinkItem, asNoShrinkItem
}
