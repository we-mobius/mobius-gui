import isolate from '@cycle/isolate'
import { makeToggle } from '../components/toggle.component'
import { makeModeDriver } from '../drivers/mode.driver'
import { THEME, makeThemeModeCurrency, makeUniqueId } from '../libs/mobius.js'

function toggleChangeToModeInput (e) {
  return makeThemeModeCurrency(e.target.checked ? THEME.MODE.DARK : THEME.MODE.LIGHT)
}

function modeOutputToToggle (modeCurrency) {
  const { value } = modeCurrency
  console.warn('part receives: ', value)
  return {
    checked: value === THEME.MODE.DARK
  }
}

function makeModeToggle ({ source }) {
  const _unique = makeUniqueId('mode-toggle')
  const toggle = isolate(
    makeToggle({
      unique: _unique,
      attrs: {},
      driverInputMapper: toggleChangeToModeInput,
      driver: makeModeDriver(),
      driverOutputMapper: modeOutputToToggle
    }),
    _unique
  )({
    DOM: source.DOM
  })
  return toggle
}

export { makeModeToggle }
