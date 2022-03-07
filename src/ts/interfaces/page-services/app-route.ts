import { tapValueT, ScopeManager, replayWithLatest } from 'MobiusUtils'
import { makeAppRouteDriver, initAppRoute } from 'MobiusServices'

export const routeDriverScopeManager = ScopeManager.of(makeAppRouteDriver)
export const appRouteDriverInstance = routeDriverScopeManager.scope('app')

initAppRoute({
  instance: appRouteDriverInstance,
  startPath: '/home'
})

tapValueT('Route', appRouteDriverInstance.outputs.currentRouteRecord)

const { outputs: { currentRouteRecord }, contexts: { routeRecordProcessT } } = appRouteDriverInstance
export const appNameRD = replayWithLatest(1, routeRecordProcessT({
  presets: { isDistinct: true, pathIndex: 1, defaultTo: 'home' }
}, currentRouteRecord))
