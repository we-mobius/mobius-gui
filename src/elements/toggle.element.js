import { div, input, label } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'

const makeToggleE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {
    checked: false
  }
} = {}) => {
  const { checked } = config

  const _inputId = `${unique}-input`

  // NOTE: DO not trigger the `change` event!!!
  // @see https://stackoverflow.com/questions/8206565/check-uncheck-checkbox-with-javascript-jquery-or-vanilla
  // const _inputEle = document.querySelector(`#${_inputId}`)
  // _inputEle && (_inputEle.checked = checked)

  return div(`${selector}.mobius-toggle.mobius-rounded--full.mobius-shadow--inset`,
    hardDeepMerge(props, { dataset: { unique } }),
    [
      input({ props: { type: 'checkbox', id: _inputId, checked: checked } }),
      label('.mobius-cursor--pointer.mobius-rounded--full', { props: { htmlFor: _inputId } })
    ]
  )
}

export { makeToggleE }
