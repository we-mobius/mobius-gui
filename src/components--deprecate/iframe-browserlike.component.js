import { makeMiddleRowAdaptiveLayoutE } from '../elements/layout-middle_row_adaptive.element.js'
import { makeMiddleColAdaptiveLayoutE } from '../elements/layout-middle_col_adaptive.element.js'
import { makeInputBoxE } from '../elements/input-box.element.js'
import { makeIframeE } from '../elements/iframe.element.js'
import { div, span } from '../libs/dom.js'
import { makeBaseComponent } from '../common/component.common.js'
import { map, combineLatest, merge, withLatestFrom } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeVNode = ({ unique, children, config }) => {
  const { url = '', src = 'https://developer.mozilla.org/', placeholder = 'Enter web address, e.g., https://www.example.com/' } = config
  const refreshBtnSelector = '.mobius-icon.mobius-icon-refresh.mobius-margin-x--r-small.mobius-text--large.mobius-cursor--pointer.hover_mobius-text--primary'
  const homepageBtnSelector = '.mobius-icon.mobius-icon-homepage--bare.mobius-margin-right--r-small.mobius-text--large.mobius-cursor--pointer.hover_mobius-text--primary'
  return makeMiddleRowAdaptiveLayoutE({
    unique: unique,
    top: makeMiddleColAdaptiveLayoutE({
      selector: '.mobius-width--100.mobius-padding-y--small',
      children: {
        left: div(
          '.mobius-layout__horizontal',
          [
            span(`.js_${unique}__refresh${refreshBtnSelector}`),
            span(`.js_${unique}__homepage${homepageBtnSelector}`)
          ]
        ),
        middle: makeInputBoxE({
          unique: `${unique}__urlbox`,
          selector: '.mobius-flex-grow--1',
          config: {
            placeholder: placeholder,
            emitOnBlur: false,
            value: url
          }
        })
      },
      config: { withAbsMidWrapper: false }
    }),
    middle: [
      makeIframeE({
        unique: `${unique}__view`,
        selector: '.mobius-size--fullpct.mobius-rounded--base',
        children: children,
        props: {},
        config: { src }
      })
    ]
  })
}

// TODO: componentToDriverMapper
export const makeBrowserlikeIframeC = ({
  unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config
}) => {
  return makeBaseComponent({
    children: children,
    intent: source => {
      const refresh$ = source.DOM.select(`.js_${unique} .js_${unique}__refresh`)
        .events('click')
        .pipe(map(e => ({ eventType: 'refresh' })))
      const homepage$ = source.DOM.select(`.js_${unique} .js_${unique}__homepage`)
        .events('click')
        .pipe(map(e => ({ eventType: 'homepage' })))
      const inputUrl$ = source.DOM.select(`.js_${unique} .js_${unique}__urlbox .js_${unique}__urlbox__event-proxy`)
        .events('confirm', undefined, false)
        .pipe(
          map(e => {
            e.detail.eventType = 'url'
            return e.detail
          })
        )
      const iframeLoaded$ = source.DOM.select(`.js_${unique} .js_${unique}__view .js_${unique}__view__event-proxy`)
        .events('loaded', undefined, false)
        .pipe(map(e => e.detail))
      return {
        refresh: refresh$,
        homepage: homepage$,
        url: inputUrl$,
        loaded: iframeLoaded$
      }
    },
    model: intent$s => ({
      event: driver.event(merge(...Object.values(intent$s))),
      placeholder: driver.placeholder()
    }),
    view: (model$s, childrenDOMs$) => {
      const model$ = combineLatest([...Object.values(model$s)]).pipe(
        map(configs => {
          return configs.reduce((acc, config) => {
            acc = { ...acc, ...config }
            return acc
          }, {})
        }),
        withLatestFrom(childrenDOMs$)
      )
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}
