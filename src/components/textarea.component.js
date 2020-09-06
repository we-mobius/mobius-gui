import { div } from '../libs/dom.js'
import { makeBaseComponent } from '../common/index.js'
import { makeTextareaE } from '../elements/textarea.element.js'
import { makeMiddleColAdaptiveLayoutE } from '../elements/layout-middle_col_adaptive.element.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius.js'

const makeTextareaVNode = ({ unique, children, config } = {}) => {
  const { field } = config
  return makeMiddleColAdaptiveLayoutE({
    unique: unique,
    selector: '.mobius-margin-y--base',
    props: {},
    config: { withAbsMidWrapper: false },
    children: {
      left: div('.mobius-padding-y--base', field),
      middle: makeTextareaE({
        unique: `${unique}__textarea`,
        selector: '.mobius-margin-x--base.mobius-flex-grow--1',
        props: { },
        children: children,
        config: { ...config }
      })
    }
  })
}

const makeTextareaC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => source.DOM.select(`.js_${unique} textarea`).events('input').pipe(
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeTextareaVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeTextareaVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}

export { makeTextareaC }
