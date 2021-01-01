import { THEME, themeObservables, makeThemeObserver } from '../libs/mobius-js.js'
import { makeBaseDriverMaker } from '../common/index.js'

export const makeLightSourceDriver = makeBaseDriverMaker(
  makeThemeObserver,
  () => themeObservables.select(THEME.TYPE.LIGHTSOURCE)
)
