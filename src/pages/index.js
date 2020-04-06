import run from '@cycle/rxjs-run'
import { makeDOMDriver, div, span } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { combineLatest, merge } from 'rxjs'
import { map, share, startWith } from 'rxjs/operators'
import { Toggle } from '../components/toggle'
import { Button } from '../components/button'
import { makeLightDriver } from '../components/light.driver'

function makeButton (source, props$, dir) {
  const btn = isolate(Button, dir)({
    DOM: source.DOM,
    props: props$.pipe(map(prop => {
      return { iconname: 'light-' + dir, dir: dir, selected: prop[dir] }
    }))
  })
  return {
    btn: btn,
    DOM: btn.DOM,
    message: btn.message
  }
}

function main (source) {
  const toggle = Toggle(source)
  const toggleVNode$ = toggle.DOM

  const props$ = source.mes.pipe(
    share()
  )

  const ltBtn = makeButton(source, props$, 'lt2rb')
  const rtBtn = makeButton(source, props$, 'rt2lb')
  const rbBtn = makeButton(source, props$, 'rb2lt')
  const lbBtn = makeButton(source, props$, 'lb2rt')

  const message$ = merge(ltBtn.message, rtBtn.message, rbBtn.message, lbBtn.message).pipe(
    startWith('lt2rb')
  )

  const vnode$ = combineLatest(toggleVNode$, ltBtn.DOM, rtBtn.DOM, rbBtn.DOM, lbBtn.DOM).pipe(
    map(([toggleDOM, ltButtonDOM, rtButtonDOM, rbButtonDOM, lbButtonDOM]) => {
      return div('.w-full.h-full.mobius-layout-portal.mobius-transition-all', [
        div('.header.flex.justify-between.items-center', [
          ltButtonDOM,
          toggleDOM,
          rtButtonDOM
        ]),
        div('.left.w-16.flex.justify-center.items-end', [
          lbButtonDOM
        ]),
        div('.main.mobius-shadow-inset.rounded', [
          div('.mobius-scrollbar-hidden.w-full.h-full.overflow-y-scroll.flex.justify-center.items-center.rounded.text-6xl.font-mono', [
            span('Mobius UI')
          ])
        ]),
        div('.footer.h-16'),
        div('.right.w-16.flex.justify-center.items-end', [
          rbButtonDOM
        ])
      ])
    })
  )

  return {
    DOM: vnode$,
    mes: message$
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  mes: makeLightDriver()
}

run(main, drivers)
