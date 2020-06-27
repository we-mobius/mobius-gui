import isolate from '@cycle/isolate'
import { makeClickButton } from '../components/clickButton.compontent'
import { makeLightSourceDriver } from '../drivers/lightsource.driver'
import { makeThemeLightSourceCurrency, makeUniqueId } from '../libs/mobius.js'

function clickEventToLightSourceInput (e) {
  return makeThemeLightSourceCurrency(e.currentTarget.dataset.lightsource)
}

function lightSourceOutputToClickButton (lightSourceCurrency) {
  const { value } = lightSourceCurrency
  return {
    selected: value
  }
}

function makeLightSourceButton ({ source, lightSource }) {
  const _unique = makeUniqueId('lightsource-button')
  const btn = isolate(
    makeClickButton({
      unique: _unique,
      attrs: {
        name: lightSource,
        iconname: `light--${lightSource}`,
        dataset: {
          lightsource: lightSource
        }
      },
      driverInputMapper: clickEventToLightSourceInput,
      driver: makeLightSourceDriver(),
      driverOutputMapper: lightSourceOutputToClickButton
    }),
    _unique
  )({
    DOM: source.DOM
  })
  return btn
}

export { makeLightSourceButton }
