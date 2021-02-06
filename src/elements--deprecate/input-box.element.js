import { div, input, span } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { makeUniqueSelector, makeCustomEvent } from '../common/element.common.js'

const baseSelector = ''

// 初始化删除按钮的功能
// NOTE: 内部会维护一部分私有变量
//   -> 按钮显示条件为： 有值 && (有焦点 || 鼠标悬浮)
const initClearBtn = (makeUnique, status) => {
  const containerElm = document.querySelector(makeUnique(''))
  const inputElm = document.querySelector(makeUnique('input'))
  const clearBtnElm = document.querySelector(makeUnique('clearbtn'))
  status = {
    isFocused: false,
    isHoverd: false,
    ...status
  }
  const adjustStyles = () => {
    const { isFocused, isHoverd } = status
    // NOTE: 初始化只执行一次，所以后续 input value 的直接更新（input.value = 'xxx'）不会反映在闭包变量 status 中，需要每次执行的时候单独获取
    const value = inputElm.value
    if (value !== '' && (isHoverd || isFocused)) {
      inputElm.style.paddingRight = '3em'
      clearBtnElm.classList.remove('mobius-display--none')
    } else {
      inputElm.style.paddingRight = ''
      clearBtnElm.classList.add('mobius-display--none')
    }
  }
  adjustStyles()
  containerElm.addEventListener('mouseover', e => {
    status.isHoverd = true
    adjustStyles()
  })
  containerElm.addEventListener('mouseout', e => {
    status.isHoverd = false
    adjustStyles()
  })
  inputElm.addEventListener('focus', e => {
    status.isFocused = true
    adjustStyles()
  })
  inputElm.addEventListener('blur', e => {
    status.isFocused = false
    adjustStyles()
  })
  clearBtnElm.addEventListener('click', e => {
    inputElm.value = ''
    adjustStyles()
  })
  inputElm.addEventListener('input', e => {
    status.value = e.target.value
    adjustStyles()
  })
}
const initEventProxy = (makeUnique, { emitOnBlur }) => {
  const eventProxyEle = document.querySelector(makeUnique('event-proxy'))
  const makeConfirmEvent = value => makeCustomEvent('confirm', { value })
  const inputEle = document.querySelector(makeUnique('input'))
  // 获得焦点时全部选中
  inputEle.addEventListener('focus', e => { e.target.select() })
  // 是否在输入框失焦时提交 value，此选项关闭时与浏览器的行为一致
  inputEle.addEventListener('blur', e => {
    if (emitOnBlur) {
      eventProxyEle.dispatchEvent(makeConfirmEvent(e.target.value))
    }
  })
  // 输入框敲击 Enter 时提交 value
  inputEle.addEventListener('keydown', e => {
    const key = e.which || e.keyCode || e.charCode
    if (key === 13) {
      eventProxyEle.dispatchEvent(makeConfirmEvent(e.target.value))
    }
  })
}

// TODO: 智能提示
// TODO: 输入验证
export const makeInputBoxE = elementOptions => {
  const { unique, selector = '', props = {}, children = [], config = {} } = elementOptions

  const {
    placeholder = props.placeholder || '点击此处输入内容...',
    emitOnBlur = false,
    value = ''
  } = config

  const makeUnique = makeUniqueSelector(unique)
  return div(
    `${makeUnique('')}${selector}${baseSelector}`,
    [
      input(
        `${makeUnique('input')}.mobius-width--100.mobius-padding-y--xs.mobius-padding-x--base.mobius-rounded--base`,
        hardDeepMerge(props, {
          style: { 'padding-right': '3em' },
          props: { placeholder, value: value },
          dataset: { unique }
        })
      ),
      div(
        '.mobius-size--fullheightabs.mobius-position--r-0.mobius-layout__horizontal.mobius-padding-right--r-xs',
        [span(`${makeUnique('clearbtn')}.mobius-icon.mobius-icon-error--bare.mobius-text--gray.hover_mobius-text--primary.mobius-padding-x--xs.mobius-cursor--pointer`)]
      ),
      div(
        `${makeUnique('event-proxy')}.mobius-display--none`,
        {
          hook: {
            insert: () => {
              initEventProxy(makeUnique, { emitOnBlur })
              initClearBtn(makeUnique, { isFocused: false, isHoverd: false })
            }
          }
        }
      )
    ]
  )
}
