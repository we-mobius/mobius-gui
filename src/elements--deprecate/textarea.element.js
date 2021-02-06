import { textarea, div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { makeTipE } from './tip.element.js'

const initTextarea = unique => {
  const hiddenDiv = document.querySelector(`.js_${unique} div`)
  const textarea = document.querySelector(`.js_${unique} textarea`)
  textarea.addEventListener('input', e => {
    hiddenDiv.innerText = textarea.value || 'Textarea placeholder'
  })
}

const textareaClasses = '.mobius-text-leading--large.mobius-padding--base.mobius-text--base.mobius-text--justify.mobius-text-break--all.mobius-font--mono'

const getMinHeight = line => `${line * 1.75 + 2}em`
const getMaxHeight = line => line ? `${line * 1.75 + 2}em` : 'none'

const makeTextareaE = ({
  unique, selector = '', props = {}, children = [], text = undefined, config = {}
} = {}) => {
  const {
    minLine = 3, maxLine, placeholder = props.placeholder || '点击此处输入内容...',
    name, value,
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
    `${unique ? '.js_' + unique : ''}${selector}.js_mobius-textarea`,
    [
      div(
        `${unique ? '.js_' + unique + '__textarea' : ''}.mobius-position--relative`,
        { dataset: { unique } },
        [
          div(
            `${textareaClasses}.mobius-visible--none.${value.length}`, // NOTE: hack to trigger sanbbdom's diff patch
            { style: { minHeight: getMinHeight(minLine), maxHeight: getMaxHeight(maxLine) } },
            [value || placeholder]
          ),
          textarea(
            `${textareaClasses}.mobius-position--absolute.mobius-position--lt.mobius-size--fullpct`,
            {
              ...hardDeepMerge(props, {
                props: { placeholder, value },
                dataset: { name, unique },
                class: {
                  'mobius-input--invalid': _isInvalidInitialValue || _isInvalidValue,
                  'mobius-input--valid': _isValid
                }
              }),
              hook: { insert: () => { initTextarea(`${unique}__textarea`) } }
            },
            [value]
          )
        ]
      ),
      div(
        `${unique ? '.js_' + unique + '__tips' : ''}`,
        { style: { display: _isShowTips ? 'block' : 'none' } },
        [...details.map(item => makeTipE({ config: item }))]
      )
    ]
  )
}

export { makeTextareaE }
