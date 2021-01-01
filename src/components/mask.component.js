import { makeMaskE } from '../elements/mask.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeMaskVNode = ({ unique, children, config }) => {
  return makeMaskE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: {
      ...config
    }
  })
}

const makeMaskC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => {},
    model: intent$ => driver(intent$),
    view: model$ => {
      const render$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: render$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeMaskVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: render$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeMaskVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}

export { makeMaskC }
