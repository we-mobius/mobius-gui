import { div, label, input } from '@cycle/dom'
import { map, startWith, tap } from 'rxjs/operators'
import { setThemeTo } from '../services/theme.service'

function Toggle (source) {
  const toggleChange$ = source.DOM.select('input').events('change')
  const vnode$ = toggleChange$.pipe(
    startWith(null),
    tap(val => {
      if (val) {
        setThemeTo(val.target.checked ? 'dark' : 'light')
      }
    }),
    map(() => div('.mobius-toggle.rounded-full.mobius-shadow-inset',
      [
        input({ attrs: { type: 'checkbox', id: 'toggle' } }),
        label('.cursor-pointer.rounded', { attrs: { for: 'toggle' } })
      ]
    )
    )
  )
  return {
    DOM: vnode$
  }
}

export default Toggle

export {
  Toggle
}
