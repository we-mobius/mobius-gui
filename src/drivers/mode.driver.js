import { THEME, themeObservables, makeThemeObserver } from '../libs/mobius.js'
import { makeBaseDriver } from '../common/index.js'

const makeModeDriver = makeBaseDriver(
  makeThemeObserver,
  () => themeObservables.select(THEME.TYPE.MODE)
)

export { makeModeDriver }
