import { makeContainerE } from '../elements/container.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeContainerVnode = ({ unique, children, config }) => {
  return makeContainerE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: {
      ...config
    }
  })
}

const makeContainerC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => {
      // container component do not have any intent
    },
    model: intent$ => driver(),
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([childsDOM]) => {
            return makeContainerVnode({ unique, children: childsDOM, config: { ...config } })
          })
        ),
        hyper: renders$.pipe(
          map(([childsDOM]) => {
            return children => makeContainerVnode({ unique, children: [...childsDOM, ...children], config: { ...config } })
          })
        )
      }
    }
  })
}

export { makeContainerC }
