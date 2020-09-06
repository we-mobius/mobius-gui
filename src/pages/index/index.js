import { div, span, a } from '@cycle/dom'
import { combineLatest, map } from '../../libs/rx.js'
import { makeCustomContainerE } from '../../elements/container-custom.element.js'
import { makePortalLayoutE } from '../../elements/layout-portal.element.js'
import { makeModeToggleP } from '../../parts/mode.part.js'
import { makeLightSourceButtonP } from '../../parts/lightsource.part.js'
import { makeAdaptiveContainerP } from '../../parts/adaptiveContainer.part.js'
import {
  equiped, asNoShrinkItem, withFullPctWidth,
  withYScroll, withScrollbarHidden
} from '../../stylizers/index.js'
import {
  title, paragraph, card, footer,
  section, sectionFull, terrace, zuma, zumaCenter,
  mockButtonGroup, mockButtonGroupSingle, mockButtonGroupBorderX, mockButtonGroupBorderY, mockButtonGroupBorderAll
} from './index.part.js'
import { THEME } from '../../libs/mobius.js'

const LOREM = 'Lorem, ipsum dolor sit amet neasd consectetur adipisicing elit. Explicabo dicta reiciendis blanditiis tempora ipsum consequatur reprehenderit temporibus nisi culpa voluptatem, unde dolores esse incidunt minima quos repellendus? Beatae, molestiae sunt.'

function indexPage (source) {
  const toggle = makeModeToggleP({ source })
  const toggle2 = makeModeToggleP({ source })

  const ltBtn = makeLightSourceButtonP({ source, lightSource: THEME.LIGHTSOURCE.LT_RB })
  const rtBtn = makeLightSourceButtonP({ source, lightSource: THEME.LIGHTSOURCE.RT_LB })
  const rbBtn = makeLightSourceButtonP({ source, lightSource: THEME.LIGHTSOURCE.RB_LT })
  const lbBtn = makeLightSourceButtonP({ source, lightSource: THEME.LIGHTSOURCE.LB_RT })

  const gt1000ContainerP = makeAdaptiveContainerP({
    source,
    conditions: {
      width: width => width >= 1000
    }
  })

  const vnode$ = combineLatest(toggle.DOM, toggle2.DOM, ltBtn.DOM, rtBtn.DOM, rbBtn.DOM, lbBtn.DOM, gt1000ContainerP.hyper).pipe(
    map(([toggleDOM, toggle2DOM, ltButtonDOM, rtButtonDOM, rbButtonDOM, lbButtonDOM, gt1000ContainerDOM]) => {
      return makePortalLayoutE({
        config: {
          type: 'flex'
        },
        children: {
          header: [ltButtonDOM, toggleDOM, toggle2DOM, rtButtonDOM],
          left: [gt1000ContainerDOM([lbButtonDOM])],
          main: [
            makeCustomContainerE(equiped(withYScroll, withScrollbarHidden, asNoShrinkItem, withFullPctWidth)({
              selector: '.mobius-padding--base',
              config: {
                // width: '300px',
                height: '500px'
              },
              children: [
                div('.mobius-border--.mobius-margin--base', [
                  div(['【寻物】下午 5 点左右，途径西府街、南大街、正东街、东一环至菜市场口丢失一把现代车钥匙，捡到者请联系！必有重谢！']),
                  a('.mobius-font--system', { props: { href: 'tel:15935197966' } }, ['联系方式：15935197966'])
                ]),
                div('.mobius-border--.mobius-margin--base', [
                  div(['【寻物】下午 5 点左右，途径西府街、南大街、正东街、东一环至菜市场口丢失一把现代车钥匙，捡到者请联系！必有重谢！']),
                  div(['联系方式：15935197966'])
                ]),
                div('.mobius-border--.mobius-margin--base', [
                  div(['【寻物】下午 5 点左右，途径西府街、南大街、正东街、东一环至菜市场口丢失一把现代车钥匙，捡到者请联系！必有重谢！']),
                  div(['联系方式：15935197966'])
                ]),
                div('.mobius-border--.mobius-margin--base', [
                  div(['【寻物】下午 5 点左右，途径西府街、南大街、正东街、东一环至菜市场口丢失一把现代车钥匙，捡到者请联系！必有重谢！']),
                  div(['联系方式：15935197966'])
                ]),
                div('.mobius-border--.mobius-margin--base', [
                  div(['【寻物】下午 5 点左右，途径西府街、南大街、正东街、东一环至菜市场口丢失一把现代车钥匙，捡到者请联系！必有重谢！']),
                  div(['联系方式：15935197966'])
                ])
              ]
            })),
            div('.mobius-scrollbar--hidden.mobius-size--fullpct.mobius-layout__vertical.mobius-flex-wrap--nowrap.mobius-padding-y--base.overflow-y-scroll.mobius-rounded--xs', [
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
            ])],
          right: [gt1000ContainerDOM([rbButtonDOM])]
        }
      })
    })
  )

  return {
    DOM: vnode$
  }
}

export { indexPage }
