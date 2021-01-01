import { THEME, themeObservables, makeThemeObserver } from '../libs/mobius-js.js'
import { makeBaseDriverMaker } from '../common/index.js'

export const makeModeDriver = makeBaseDriverMaker(
  makeThemeObserver,
  () => themeObservables.select(THEME.TYPE.MODE)
)
