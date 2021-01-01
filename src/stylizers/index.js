import {
  isString, isObject, hasOwnProperty,
  indexOf,
  filterTruthy, unique, join,
  curry, compose
} from '../libs/mobius-utils.js'

export const isElementOptions = options => hasOwnProperty('selector', options)
export const isVNode = options => hasOwnProperty('sel', options) && hasOwnProperty('elm', options)

// neatenSelectors :: [a] -> b
export const neatenSelectors = compose(join(''), unique, filterTruthy)
export const mergeSelectors = (...args) => {
  const selectors = args.reduce((acc, cur) => {
    if (!cur) return acc

    if (!/^[.|#].*/.test(cur)) {
      acc.tag = acc.tag ? acc.tag : /^([\w\W]*?)(?=\.|#|$)/.exec(cur)[1]
    }

    Array.from(cur.matchAll(/([.|#]+[^.^#]*)/g)).forEach(item => {
      if (indexOf('.', item[1]) > -1) {
        acc.class.push(item[1])
      } else if (indexOf('#', item[1]) > -1) {
        acc.id.push(item[1])
      }
    })

    return acc
  }, { tag: '', id: [], class: [] })
  return selectors.tag + neatenSelectors(selectors.id) + neatenSelectors(selectors.class)
}

export const addSelector = curry((selector, options) => {
  if (isString(options)) {
    return mergeSelectors(options, selector)
  } else {
    if (isElementOptions(options)) {
      options.selector = mergeSelectors(options.selector, selector)
    } else if (isVNode(options)) {
      options.sel = mergeSelectors(options.sel, selector)
    } else if (isObject(options)) {
      options.selector = mergeSelectors(options.selector, selector)
    }
    return options
  }
})

/******************************************
 *               Container
 ******************************************/

export const withFullPctWidth = addSelector('.mobius-width--100')
export const withFullPctHeight = addSelector('.mobius-height--100')
export const withFullPct = addSelector('.mobius-size--fullpct')
export const withFullViewWidth = addSelector('.mobius-width--100vw')
export const withFullViewHeight = addSelector('.mobius-height--100vh')
export const withFullView = addSelector('.mobius-size--fullview')
export const withFullAbsWidth = addSelector('.mobius-size--fullwidthabs')
export const withFullAbsHeight = addSelector('.mobius-size--fullheightabs')
export const withFullAbs = addSelector('.mobius-size--fullabs')

export const withXScroll = addSelector('.mobius-scroll--x')
export const withYScroll = addSelector('.mobius-scroll--y')
export const withAllScroll = addSelector('.mobius-scroll--all')
export const withScrollbarHidden = addSelector('.mobius-scrollbar--hidden')

export const withPositionRelative = addSelector('.mobius-position--relative')
export const withPositionAbsolute = addSelector('.mobius-position--absolute')
export const withPositionFixed = addSelector('.mobius-position--fixed')
export const withPositionSticky = addSelector('.mobius-position--sticky')

export const asFlexContainer = addSelector('.mobius-display--flex')

export const withPresetHorizontal = addSelector('.mobius-layout__horizontal')
export const withPresetVertical = addSelector('.mobius-layout__vertical')

export const withDirectionRow = addSelector('.mobius-flex-dir--row')
export const withDirectionRowReverse = addSelector('.mobius-flex-dir--rowreverse')
export const withDriectionColumn = addSelector('.mobius-flex-dir--column')
export const withDriectionColumnReverse = addSelector('.mobius-flex-dir--columnreverse')

export const withWrap = addSelector('.mobius-flex-wrap--normal')
export const withWrapReverse = addSelector('.mobius-flex-wrap--reverse')
export const withNoWrap = addSelector('.mobius-flex-wrap--nowrap')

export const withJustifyStart = addSelector('.mobius-flex-justify--start')
export const withJustifyCenter = addSelector('.mobius-flex-justify--center')
export const withJustifyEnd = addSelector('.mobius-flex-justify--end')
export const withJustifyBetween = addSelector('.mobius-flex-justify--between')
export const withJustifyAround = addSelector('.mobius-flex-justify--around')
export const withJustifyEvenly = addSelector('.mobius-flex-justify--evenly')

export const withItemsStart = addSelector('.mobius-flex-items--start')
export const withItemsCenter = addSelector('.mobius-flex-items--center')
export const withItemsEnd = addSelector('.mobius-flex-items--end')
export const withItemsStretch = addSelector('.mobius-flex-items--stretch')
export const withItemsBaseline = addSelector('.mobius-flex-items--baseline')

export const asStartItem = addSelector('.mobius-flex-item--start')
export const asCenterItem = addSelector('.mobius-flex-item--center')
export const asEndItem = addSelector('.mobius-flex-item--end')
export const asStretchItem = addSelector('.mobius-flex-item--stretch')
export const asBaselineItem = addSelector('.mobius-flex-items--baseline')

export const asGrowItem = addSelector('.mobius-flex-grow--1')
export const asNoGrowItem = addSelector('.mobius-flex-grow--0')
export const asShrinkItem = addSelector('.mobius-flex-shrink--1')
export const asNoShrinkItem = addSelector('.mobius-flex-shrink--0')

/******************************************
 *                Box Model
 ******************************************/

export const withBorderBox = addSelector('.mobius-box--border')
export const withContentBox = addSelector('.mobius-box--content')

/******************************************
 *                 Others
 ******************************************/

export const withSelectAuto = addSelector('.mobius-select--auto')
export const withSelectNone = addSelector('.mobius-select--none')
export const withSelectAll = addSelector('.mobius-select--all')
export const withSelectText = addSelector('.mobius-select--text')
export const withSelectContain = addSelector('.mobius-select--contain')

export const withCursorPointer = addSelector('.mobius-cursor--pointer')

export const withTransitionAll = addSelector('.mobius-transition--all')
