import { makeInputBoxE } from '../elements/input-box.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeVNode = ({ unique, children, config }) => {
  return makeInputBoxE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: { ...config }
  })
}

export const makeInputBoxC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => source.DOM.select(`.js_${unique} .js_${unique}__event-proxy`).events('confirm', undefined, false).pipe(
      map(e => e.detail.value),
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
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
