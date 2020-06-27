import { div, span, a } from '@cycle/dom'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { makeModeToggle } from '../parts/mode.part'
import { makeLightSourceButton } from '../parts/lightsource.part'
import {
  title, paragraph, card, footer,
  section, sectionFull, terrace, zuma, zumaCenter,
  mockButtonGroup, mockButtonGroupSingle, mockButtonGroupBorderX, mockButtonGroupBorderY, mockButtonGroupBorderAll
} from './index.part'
import { THEME } from '../libs/mobius.js'

const LOREM = 'Lorem, ipsum dolor sit amet neasd consectetur adipisicing elit. Explicabo dicta reiciendis blanditiis tempora ipsum consequatur reprehenderit temporibus nisi culpa voluptatem, unde dolores esse incidunt minima quos repellendus? Beatae, molestiae sunt.'

function main (source) {
  const toggle = makeModeToggle({ source })
  const toggle2 = makeModeToggle({ source })

  const ltBtn = makeLightSourceButton({ source, lightSource: THEME.LIGHTSOURCE.LT_RB })
  const rtBtn = makeLightSourceButton({ source, lightSource: THEME.LIGHTSOURCE.RT_LB })
  const rbBtn = makeLightSourceButton({ source, lightSource: THEME.LIGHTSOURCE.RB_LT })
  const lbBtn = makeLightSourceButton({ source, lightSource: THEME.LIGHTSOURCE.LB_RT })

  const vnode$ = combineLatest(toggle.DOM, toggle2.DOM, ltBtn.DOM, rtBtn.DOM, rbBtn.DOM, lbBtn.DOM).pipe(
    map(([toggleDOM, toggle2DOM, ltButtonDOM, rtButtonDOM, rbButtonDOM, lbButtonDOM]) => {
      return div('.w-full.h-full.mobius-layout__portal.mobius-transition--all', [
        div('.header.mobius-layout__horizontal.mobius-flex-justify--between', [
          ltButtonDOM,
          toggleDOM,
          toggle2DOM,
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
    DOM: vnode$
  }
}

export { main }
