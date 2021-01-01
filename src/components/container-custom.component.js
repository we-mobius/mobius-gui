import { makeCustomContainerE } from '../elements/container-custom.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeContainerVnode = ({ unique, children, config: { isShow } }) => {
  return makeCustomContainerE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: {
      isShow
    }
  })
}

const makeCustomContainerC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
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
          map(([{ isShow }, childsDOM]) => {
            console.warn(`[ContainerComponent][${unique}] isShow -> ${isShow}`)
            return makeContainerVnode({ unique, children: childsDOM, config: { ...config, isShow } })
          })
        ),
        hyper: renders$.pipe(
          map(([{ isShow }]) => {
            console.warn(`[ContainerComponent][${unique}] isShow -> ${isShow}`)
            return children => makeContainerVnode({ unique, children: children, config: { ...config, isShow } })
          })
        )
      }
    }
  })
}

export { makeCustomContainerC }
