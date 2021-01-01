import { div } from '../libs/dom.js'
import { makeBaseComponent } from '../common/index.js'
import { makeSelectE } from '../elements/select.element.js'
import { makeMiddleColAdaptiveLayoutE } from '../elements/layout-middle_col_adaptive.element.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeSelectVNode = ({ unique, children, config }) => {
  const { field } = config
  return makeMiddleColAdaptiveLayoutE({
    unique: unique,
    selector: '.mobius-margin-y--base',
    props: {},
    config: { withAbsMidWrapper: false },
    children: {
      left: div('.mobius-padding-y--base', field),
      middle: makeSelectE({
        unique: `${unique}__select`,
        selector: '.mobius-margin-x--base.mobius-flex-grow--1',
        props: {},
        chilren: children,
        config: { ...config }
      })
    }
  })
}

const makeSelectC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => source.DOM.select(`.js_${unique} select`).events('change').pipe(
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeSelectVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeSelectVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}

export { makeSelectC }
