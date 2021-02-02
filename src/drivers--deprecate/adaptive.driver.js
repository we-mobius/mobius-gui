import { deviceObservables } from '../libs/mobius-js.js'
import { makeBaseDriverMaker } from '../common/index.js'

export const makeAdaptiveDriver = makeBaseDriverMaker(
  () => {},
  () => deviceObservables.chunk()
)
