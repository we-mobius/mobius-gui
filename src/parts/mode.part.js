import { makeBasePart } from '../common/index.js'
import { makeToggleC } from '../components/toggle.component'
import { makeModeDriver } from '../drivers/mode.driver'
import { THEME, makeThemeModeCurrency } from '../libs/mobius-js.js'

function toggleChangeToModeInput (e) {
  return makeThemeModeCurrency(e.target.checked ? THEME.MODE.DARK : THEME.MODE.LIGHT)
}

function modeOutputToToggleConfig (modeCurrency) {
  const { value } = modeCurrency
  return {
    checked: value === THEME.MODE.DARK
  }
}

function makeModeToggleP ({ source }) {
  return makeBasePart({
    name: 'mode-toggle',
    source: source,
    componentMaker: ({ unique }) => makeToggleC({
      unique: unique,
      componentToDriverMapper: toggleChangeToModeInput,
      driver: makeModeDriver(),
      driverToComponentMapper: modeOutputToToggleConfig,
      config: {}
    })
  })
}

export { makeModeToggleP }
