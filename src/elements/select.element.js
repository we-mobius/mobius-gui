import { div, select, option } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius.js'
import { makeTipE } from './tip.element.js'

const initSelect = elm => {
  elm.addEventListener('change', e => {
    elm.setAttribute('value', e.target.value)
  })
}

const baseSelector = '.mobius-text-leading--large.mobius-padding--base.mobius-text--base'
const makeSelectE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
} = {}) => {
  const {
    list = [], name, value, placeholder = '点击进行选择...',
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
      select(
        `${unique ? '.js_' + unique + '__select' : ''}.mobius-width--100${baseSelector}`,
        hardDeepMerge(props, {
          dataset: { name, unique },
          attrs: { value: value || ' ' },
          hook: { insert: e => { initSelect(e.elm) } },
          class: {
            'mobius-input--invalid': _isInvalidInitialValue || _isInvalidValue,
            'mobius-input--valid': _isValid
          }
        }),
        [
          option({ props: { disabled: true, selected: !value, value: ' ' } }, placeholder),
          ...list.map(item => option({ props: { value: item.value, selected: item.value === value } }, item.text))
        ]
      ),
      div(
        `${unique ? '.js_' + unique + '__tips' : ''}`,
        { style: { display: _isShowTips ? 'block' : 'none' } },
        [...details.map(item => makeTipE({ config: item }))]
      )
    ])
}

export { makeSelectE }
