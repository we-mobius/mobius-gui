import { div, span } from '@cycle/dom'
import { map } from 'rxjs/operators'

const normalBtn = (iconName, dir) => div(
  '.button.w-12.h-12.m-2.rounded.mobius-shadow-normal.hover_mobius-bg-convex.cursor-pointer.flex.items-center.justify-center.hover_mobius-text-primary',
  { attrs: { 'data-dir': dir } },
  [span(`.mobius-icon.mobius-icon-${iconName}.text-2xl`)]
)

const selectedBtn = (iconName, dir) => div(
  '.button.w-12.h-12.m-2.rounded.mobius-shadow-inset.hover_mobius-bg-concave.cursor-pointer.flex.items-center.justify-center.mobius-text-primary',
  { attrs: { 'data-dir': dir } },
  [span(`.mobius-icon.mobius-icon-${iconName}.text-2xl`)]
)

function Button (source) {
  const clickEvt$ = source.DOM.select('.button').events('click')
  const props$ = source.props
  const vnode$ = props$.pipe(
    map(({ iconname, dir, selected }) => {
      return selected ? selectedBtn(iconname, dir) : normalBtn(iconname, dir)
    })
  )

  return {
    DOM: vnode$,
    message: clickEvt$.pipe(
      map(e => e.currentTarget.dataset.dir)
    )
  }
}

export default Button

export {
  Button
}
