import { makePopoutE } from '../elements/popout.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius.js'

const makePopoutVNode = ({ unique, children, config }) => {
  return makePopoutE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: {
      ...config
    }
  })
}

const makePopoutC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => {},
    model: intent$ => driver(intent$),
    view: model$ => {
      const render$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: render$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makePopoutVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: render$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makePopoutVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}

export { makePopoutC }
