import { makeContainerE } from '../elements/container.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'

const makeContainerVnode = ({ unique, children, config: { isShow } }) => {
  return makeContainerE({
    unique: unique,
    selector: `.js_${unique}`,
    children: children,
    props: {},
    config: {
      isShow
    }
  })
}

const makeContainerC = ({ unique, children, componentToDriverMapper, driver, driverToComponentMapper }) => {
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
            return makeContainerVnode({ unique, children: childsDOM, config: { isShow } })
          })
        ),
        hyper: renders$.pipe(
          map(([{ isShow }]) => {
            console.warn(`[ContainerComponent][${unique}] isShow -> ${isShow}`)
            return children => makeContainerVnode({ unique, children: children, config: { isShow } })
          })
        )
      }
    }
  })
}

export { makeContainerC }
