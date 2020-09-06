import { div, input } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'
import { makeTipE } from './tip.element.js'

const baseSelector = '.mobius-text-leading--large.mobius-padding--base.mobius-text--base'

const makeInputE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
} = {}) => {
  const {
    placeholder = props.placeholder || '点击此处输入内容...',
    name, inputType = 'text', value,
    initialValue, isModified = false,
    validity = { isValid: false, details: [] },
    alwaysShowTips = false
  } = config

  const { isValid, details } = validity

  const _isValid = isValid
  const _isInvalidInitialValue = (!!initialValue && !isValid)
  const _isInvalidValue = isModified && !isValid
  const _isShowTips = (alwaysShowTips || _isInvalidInitialValue || _isInvalidValue) && details.length > 0

  return div(
    `${unique ? '.js_' + unique : ''}${selector}`,
    [
      input(
        `${unique ? '.js_' + unique + '__input' : ''}.mobius-width--100${baseSelector}`,
        hardDeepMerge(props, {
          props: { placeholder, value, type: inputType },
          dataset: { name, unique },
          // snabbdom 会在 key 和 sel 不等的时候对元素进行 recreate，元素 recreate 会失焦
          // 可以使用 Class Module 解决，也可以选择手动更新 class
          class: {
            'mobius-input--invalid': _isInvalidInitialValue || _isInvalidValue,
            'mobius-input--valid': _isValid
          }
        })
      ),
      div(
        `${unique ? '.js_' + unique + '__tips' : ''}`,
        { style: { display: _isShowTips ? 'block' : 'none' } },
        [...details.map(item => makeTipE({ config: item }))]
      )
    ]
  )
}

export { makeInputE }
