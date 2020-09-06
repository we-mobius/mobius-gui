import { map } from '../libs/rx.js'
import { makeBaseComponent } from '../common/index.js'
import { makePressButtonE } from '../elements/button-press.element.js'
import { asIs } from '../libs/mobius.js'

function makePressButtonVNode ({ unique, config }) {
  return makePressButtonE({
    unique: unique,
    selector: '',
    props: { },
    config: { ...config }
  })
}

function makePressButtonC ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) {
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
            return makePressButtonVNode({ unique, config: { ...config, ...buttonConfig } })
          })
        )
      }
    }
  })
}

export {
  makePressButtonC
}
