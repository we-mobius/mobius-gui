import { adapt } from '@cycle/run/lib/adapt'
import { deviceObservables, makeCycleDriverMaker } from '../libs/mobius.js'

const makeAdaptiveDriver = makeCycleDriverMaker(
  () => {},
  () => deviceObservables.chunk(),
  // @see https://cycle.js.org/drivers.html
  // In order to make your driver usable with many stream libraries,
  // you should use the adapt() function from @cycle/run/lib/adapt
  // to convert the stream to the same library used for run.
  // adapt() takes an xstream stream as input
  // and returns a stream for the library used in run.
  adapt
)

export { makeAdaptiveDriver }
