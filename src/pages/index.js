import run from '@cycle/rxjs-run'
import { makeDOMDriver, div, span } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { combineLatest, merge } from 'rxjs'
import { map, share, startWith } from 'rxjs/operators'
import { Toggle } from '../components/toggle'
import { Button } from '../components/button'
import { makeLightDriver } from '../components/light.driver'

const LOREM = 'Lorem, ipsum dolor sit amet neasd consectetur adipisicing elit. Explicabo dicta reiciendis blanditiis tempora ipsum consequatur reprehenderit temporibus nisi culpa voluptatem, unde dolores esse incidunt minima quos repellendus? Beatae, molestiae sunt.'

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
          div('.mobius-scrollbar-hidden.w-full.h-full.overflow-y-scroll.flex.flex-wrap.justify-around.items-start.rounded', [
            div('.w-full.h-48.flex.justify-center.items-center.text-6xl.font-mono.mobius-font-noto', [
              span('Mobius UI')
            ]),
            div('.w-full.h-auto.py-4.px-8.text-justify.hover_mobius-text-primary', LOREM + LOREM),
            div('.w-full.h-auto.py-4.px-8.text-justify.hover_mobius-text-primary', LOREM + LOREM),
            div('.w-full.h-auto.flex.justify-between.m-8', [
              div('.mobius-shadow-normal.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify.hover_mobius-text-primary', LOREM),
              div('.mobius-shadow-inset.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify.hover_mobius-text-primary', LOREM),
              div('.mobius-shadow-normal.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify.hover_mobius-text-primary', LOREM),
              div('.mobius-shadow-inset.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify.hover_mobius-text-primary', LOREM)
            ]),
            div('.w-full.h-auto.flex.justify-between.m-8', [
              div('.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify', LOREM),
              div('.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify', LOREM),
              div('.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify', LOREM),
              div('.w-1/5.h-auto.p-4.rounded.cursor-pointer.text-justify', LOREM)
            ]),
            // 无边框按钮
            div('.w-full.h-auto.flex.justify-around.m-8', [
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.rounded.cursor-pointer.hover_mobius-text-primary', 'Mock Button Normal'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.rounded.cursor-pointer.mobius-text-primary', 'Mock Button Primary'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.rounded-full.cursor-pointer.hover_mobius-text-primary', 'Mock Button Rounded'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.rounded-full.cursor-pointer.mobius-text-primary', 'Mock Button Rounded')
            ]),
            // 全边框按钮
            div('.w-full.h-auto.flex.justify-around.m-8', [
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-all.rounded.cursor-pointer.hover_mobius-text-primary', 'Mock Button Normal'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-all.rounded.cursor-pointer.mobius-text-primary', 'Mock Button Primary'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-all.rounded-full.cursor-pointer.hover_mobius-text-primary', 'Mock Button Rounded'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-all.rounded-full.cursor-pointer.mobius-text-primary', 'Mock Button Rounded')
            ]),
            // 单边按钮
            div('.w-full.h-auto.flex.justify-around.m-8', [
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-top.rounded.cursor-pointer.hover_mobius-text-primary', 'Mock Button Normal'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-bottom.rounded.cursor-pointer.mobius-text-primary', 'Mock Button Primary'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-left.rounded-full.cursor-pointer.hover_mobius-text-primary', 'Mock Button Rounded'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-right.rounded-full.cursor-pointer.mobius-text-primary', 'Mock Button Rounded')
            ]),
            // 横向按钮
            div('.w-full.h-auto.flex.justify-around.m-8', [
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-x.rounded.cursor-pointer.hover_mobius-text-primary', 'Mock Button Normal'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-x.rounded.cursor-pointer.mobius-text-primary', 'Mock Button Primary'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-x.rounded-full.cursor-pointer.hover_mobius-text-primary', 'Mock Button Rounded'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-x.rounded-full.cursor-pointer.mobius-text-primary', 'Mock Button Rounded')
            ]),
            // 纵向按钮
            div('.w-full.h-auto.flex.justify-around.m-8', [
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-y.rounded.cursor-pointer.hover_mobius-text-primary', 'Mock Button Normal'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-y.rounded.cursor-pointer.mobius-text-primary', 'Mock Button Primary'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-y.rounded-full.cursor-pointer.hover_mobius-text-primary', 'Mock Button Rounded'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-border-y.rounded-full.cursor-pointer.mobius-text-primary', 'Mock Button Rounded')
            ]),
            div('.w-full.h-auto.flex.justify-around.m-8', [
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-bg-primary.rounded.cursor-pointer', 'Mock Button Normal'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-bg-primary.rounded.cursor-pointer', 'Mock Button Primary'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-bg-primary.rounded-full.cursor-pointer', 'Mock Button Rounded'),
              div('.mobius-shadow-normal.w-auto.h-auto.my-8.p-4.active_mobius-shadow-thin.mobius-bg-primary.rounded-full.cursor-pointer', 'Mock Button Rounded')
            ])
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
