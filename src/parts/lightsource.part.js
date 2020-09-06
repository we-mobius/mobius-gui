import { makeBasePart } from '../common/index.js'
import { makePressButtonC } from '../components/button-press.component.js'
import { makeLightSourceDriver } from '../drivers/lightsource.driver.js'
import { makeThemeLightSourceCurrency } from '../libs/mobius.js'

const makeDriverToComponentMapper = lightSource => lightSourceCurrency => {
  return {
    pressed: lightSource === lightSourceCurrency.value
  }
}

function makeLightSourceButtonP ({ source, lightSource }) {
  return makeBasePart({
    name: 'lightsource-button',
    source: source,
    componentMaker: ({ unique }) => makePressButtonC({
      unique: unique,
      componentToDriverMapper: e => makeThemeLightSourceCurrency(e.currentTarget.dataset.lightsource),
      driver: makeLightSourceDriver(),
      driverToComponentMapper: makeDriverToComponentMapper(lightSource),
      config: {
        name: lightSource,
        icon: `light--${lightSource}`
      }
    })
  })
}

export { makeLightSourceButtonP }
