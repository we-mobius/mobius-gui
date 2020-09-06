import { deviceObservables } from '../libs/mobius.js'
import { makeBaseDriver } from '../common/index.js'

const makeAdaptiveDriver = makeBaseDriver(
  () => {},
  () => deviceObservables.chunk()
)

export { makeAdaptiveDriver }
