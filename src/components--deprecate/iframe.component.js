import { makeIframeE } from '../elements/iframe.element.js'
import { makeBaseComponent } from '../common/component.common.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeVNode = ({ unique, children, config }) => {
  return makeIframeE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: { ...config }
  })
}

export const makeIframeC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => {
      // Iframe component do not have any intent
    },
    model: intent$ => driver(),
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
