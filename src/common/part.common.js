import isolate from '@cycle/isolate'
import { makeUniqueId } from '../libs/mobius.js'

export const makeSimplePart = ({ name, source, componentMaker }) => {
  const _unique = makeUniqueId(name)
  return componentMaker({ unique: _unique })(source)
}

export const makeBasePart = ({ name, source, componentMaker }) => {
  const _unique = makeUniqueId(name)
  return isolate(componentMaker({ unique: _unique }), _unique)(source)
}
