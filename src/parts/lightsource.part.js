import { makeBasePart } from '../common/index.js'
import { makeButtonC } from '../components/button.component.js'
import { makeLightSourceDriver } from '../drivers/lightsource.driver.js'
import { makeThemeLightSourceCurrency } from '../libs/mobius.js'

function clickEventToLightSourceInput (e) {
  return makeThemeLightSourceCurrency(e.currentTarget.dataset.lightsource)
}

function lightSourceOutputToButtonConfig (lightSourceCurrency) {
  const { value } = lightSourceCurrency
  return {
    selected: value
  }
}

function makeLightSourceButtonP ({ source, lightSource }) {
  return makeBasePart({
    name: 'lightsource-button',
    source: source,
    componentMaker: ({ unique }) => makeButtonC({
      unique: unique,
      componentToDriverMapper: clickEventToLightSourceInput,
      driver: makeLightSourceDriver(),
      driverToComponentMapper: lightSourceOutputToButtonConfig,
      config: {
        name: lightSource,
        iconname: `light--${lightSource}`,
        dataset: {
          lightsource: lightSource
        }
      }
    })
  })
}

export { makeLightSourceButtonP }
