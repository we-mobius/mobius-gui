import { makeBaseComponent } from '../common/index.js'
import { makeTabbarE } from '../elements/tabbar.element.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius.js'

const makeTabbarVNode = ({ unique, children, config }) => {
  return makeTabbarE({
    unique: unique,
    selector: `.js_${unique}`,
    props: {},
    chidren: children,
    config: { ...config }
  })
}

const makeTabbarC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => source.DOM.select('.js_mobius-tabbar').events('click').pipe(
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([tabbarConfig, childsDOM]) => {
            return makeTabbarVNode({ unique, children: childsDOM, config: { ...config, ...tabbarConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([tabbarConfig, childsDOM]) => {
            return children => makeTabbarVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...tabbarConfig } })
          })
        )
      }
    }
  })
}

export { makeTabbarC }
