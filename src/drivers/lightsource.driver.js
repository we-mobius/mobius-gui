import { THEME, themeObservables, makeThemeObserver } from '../libs/mobius.js'
import { makeBaseDriver } from '../common/index.js'

const makeLightSourceDriver = makeBaseDriver(
  makeThemeObserver,
  () => themeObservables.select(THEME.TYPE.LIGHTSOURCE)
)

export { makeLightSourceDriver }
