import { map } from '../libs/rx.js'
import { makeBaseComponent } from '../common/index.js'
import { makeButtonE } from '../elements/button.element.js'
import { asIs } from '../libs/mobius-utils.js'

function makeButtonVNode ({ unique, config }) {
  return makeButtonE({
    unique: unique,
    selector: '',
    props: { },
    config: { ...config }
  })
}

function makeButtonC ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) {
  return makeBaseComponent({
    intent: source => source.DOM.select(`.js_${unique}`).events('click').pipe(
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      return {
        DOM: model$.pipe(
          map(([driverOutput]) => [driverToComponentMapper(driverOutput)]),
          map(([buttonConfig]) => {
            return makeButtonVNode({ unique, config: { ...config, ...buttonConfig } })
          })
        )
      }
    }
  })
}

export {
  makeButtonC
}
