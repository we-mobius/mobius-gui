import { makeBaseDriverMaker } from '../common/index.js'
import {
  ofType,
  routerObservers, routerObservables,
  makeBaseScopeManager
} from '../libs/mobius-js.js'

export const makeRouterDriver = () => {
  const _observers = routerObservers
  const _observables = routerObservables
  const driverMaker = makeBaseDriverMaker(
    () => ofType('pathname', _observers),
    () => ofType('pathname', _observables)
  )
  return {
    observers: _observers,
    observables: _observables,
    maker: driverMaker,
    driver: driverMaker()
  }
}

export const routerDriverManager = makeBaseScopeManager({ maker: makeRouterDriver })
routerDriverManager.registerScope('app', makeRouterDriver())
