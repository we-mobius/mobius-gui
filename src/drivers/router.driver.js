import { makeBaseDriver } from '../common/index.js'
import {
  routerObservers, routerObservables,
  makeBaseScopeManager,
  ofType
} from '../libs/mobius.js'

export const makeRouterDriver = () => {
  const _observers = routerObservers
  const _observables = routerObservables
  const driverMaker = makeBaseDriver(
    () => ofType('path', _observers),
    () => ofType('path', _observables)
  )
  return {
    observers: _observers,
    observables: _observables,
    maker: driverMaker,
    driver: driverMaker()
  }
}

export const routerDriverManager = makeBaseScopeManager()
routerDriverManager.registerScope('app', makeRouterDriver())
