import { makeToggleE } from '../elements/toggle.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'

function makeToggleVnode ({ unique, config: { checked } }) {
  return makeToggleE({
    unique: unique,
    selector: `.js_${unique}`,
    config: { checked }
  })
}

function makeToggleC ({ unique, componentToDriverMapper, driver, driverToComponentMapper, config }) {
  return makeBaseComponent({
    intent: source => source.DOM.select('input').events('change').pipe(
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      return {
        DOM: model$.pipe(
          map(([driverOutput]) => [driverToComponentMapper(driverOutput)]),
          map(([toggleConfig]) => {
            return makeToggleVnode({ unique, config: { ...toggleConfig } })
          })
        )
      }
    }
  })
}

export { makeToggleC }
