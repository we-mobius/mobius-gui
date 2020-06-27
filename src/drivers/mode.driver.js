import { adapt } from '@cycle/run/lib/adapt'

import { THEME, themeObservables, makeThemeObserver, makeCycleDriverMaker } from '../libs/mobius.js'

const makeModeDriver = makeCycleDriverMaker(
  makeThemeObserver,
  () => themeObservables.select(THEME.TYPE.MODE),
  // @see https://cycle.js.org/drivers.html
  // In order to make your driver usable with many stream libraries,
  // you should use the adapt() function from @cycle/run/lib/adapt
  // to convert the stream to the same library used for run.
  // adapt() takes an xstream stream as input
  // and returns a stream for the library used in run.
  adapt
)

export { makeModeDriver }
