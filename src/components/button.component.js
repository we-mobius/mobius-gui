import { map } from '../libs/rx.js'
import { makeBaseComponent } from '../common/index.js'
import { makeButtonE } from '../elements/button.element.js'

function makeButtonVNode ({ unique, config: { name, iconname, dataset, selected } }) {
  return makeButtonE({
    unique: unique,
    selector: `.js_${unique}`,
    props: { dataset },
    config: {
      name: name,
      icon: iconname,
      selected: selected
    }
  })
}

function makeButtonC ({ unique, componentToDriverMapper, driver, driverToComponentMapper, config }) {
  return makeBaseComponent({
    intent: source => source.DOM.select('.js_mobius-button').events('click').pipe(
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
