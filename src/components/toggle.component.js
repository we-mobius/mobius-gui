import { div, input, label } from '@cycle/dom'
import { map } from 'rxjs/operators'

function _makeToggleVnode (unique, attrs, { checked }) {
  const _inputId = `${unique}-input`
  // NOTE: DO not trigger the `change` event!!!
  // @see https://stackoverflow.com/questions/8206565/check-uncheck-checkbox-with-javascript-jquery-or-vanilla
  const _inputEle = document.querySelector(`#${_inputId}`)
  _inputEle && (_inputEle.checked = checked)

  return div(`.js_${unique}.mobius-toggle.mobius-rounded--full.mobius-shadow--inset`,
    [
      input({ attrs: { type: 'checkbox', id: _inputId, checked } }),
      label('.mobius-cursor--pointer.mobius-rounded--full', { attrs: { for: _inputId } })
    ]
  )
}

function makeToggle ({ unique, attrs, driverInputMapper, driver, driverOutputMapper }) {
  return (source) => {
    const toggleChange$ = source.DOM.select('input').events('change').pipe(
      map(driverInputMapper)
    )

    const vnode$ = driver(toggleChange$).pipe(
      map(driverOutputMapper),
      map((toggleConfig) => {
        return _makeToggleVnode(unique, attrs, toggleConfig)
      })
    )

    return {
      DOM: vnode$
    }
  }
}

export { makeToggle }
