import run from '@cycle/rxjs-run'
import { makeDOMDriver, div, span, a } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { combineLatest, merge } from 'rxjs'
import { map, share, startWith } from 'rxjs/operators'
import { Toggle } from '../components/toggle'
import { Button } from '../components/button'
import { makeLightDriver } from '../components/light.driver'
import {
  title, paragraph, card, footer,
  section, sectionFull, terrace, zuma, zumaCenter,
  mockButtonGroup, mockButtonGroupSingle, mockButtonGroupBorderX, mockButtonGroupBorderY, mockButtonGroupBorderAll
} from './index.part'

const LOREM = 'Lorem, ipsum dolor sit amet neasd consectetur adipisicing elit. Explicabo dicta reiciendis blanditiis tempora ipsum consequatur reprehenderit temporibus nisi culpa voluptatem, unde dolores esse incidunt minima quos repellendus? Beatae, molestiae sunt.'

function makeButton (source, props$, dir) {
  const btn = isolate(Button, dir)({
    DOM: source.DOM,
    props: props$.pipe(map(prop => {
      return { iconname: 'light--' + dir, dir: dir, selected: prop[dir] }
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
      return div('.w-full.h-full.mobius-layout__portal.mobius-transition--all', [
        div('.header.mobius-layout__horizontal.mobius-flex-justify--between', [
          ltButtonDOM,
          toggleDOM,
          rtButtonDOM
        ]),
        div('.left.mobius-width--4rem.mobius-layout__vertical.mobius-flex-justify--end', [
          lbButtonDOM
        ]),
        div('.main.mobius-shadow--inset.mobius-rounded--xs', [
          div('.mobius-scrollbar--hidden.mobius-width--100.mobius-height--100.mobius-layout__vertical.mobius-flex-wrap--nowrap.mobius-padding-y--base.overflow-y-scroll.mobius-rounded--xs', [
            title('Mobius UI'),
            section(paragraph('.mobius-font--sans')),
            section(paragraph('.mobius-font--serif')),
            section(zuma([
              terrace(LOREM),
              terrace(LOREM),
              terrace(LOREM),
              terrace(LOREM)
            ])),
            section(zuma([
              card(LOREM),
              card(LOREM),
              card(LOREM)
            ])),
            sectionFull(zumaCenter([
              ...mockButtonGroup
            ])),
            sectionFull(zumaCenter([
              ...mockButtonGroupSingle
            ])),
            sectionFull(zumaCenter([
              ...mockButtonGroupBorderX
            ])),
            sectionFull(zumaCenter([
              ...mockButtonGroupBorderY
            ])),
            sectionFull(zumaCenter([
              ...mockButtonGroupBorderAll
            ])),
            footer([
              span('.mobius-icon.mobius-icon-logo-github'),
              a(
                '.mobius-text--underline.mobius-text--primary',
                { attrs: { href: 'https://github.com/we-mobius/mobius-ui' } },
                ' Made with ♥ by Cigaret.'
              )
            ])
          ])
        ]),
        // div('.footer.h-16'),
        div('.right.mobius-width--4rem.mobius-layout__vertical.mobius-flex-justify--end', [
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
