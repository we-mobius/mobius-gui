import { makeBaseDriver } from '../common/index.js'
import { shareReplay, startWith } from '../libs/rx.js'
import { defaultMaskElementConfig } from '../elements/mask.element.js'
import { makeBaseRepository, ofType, makeBaseScopeManager } from '../libs/mobius.js'

export const makeMaskDriver = () => {
  const [maskIn$, maskOut$] = makeBaseRepository().array
  const maskOutShare$ = maskOut$.pipe(startWith(defaultMaskElementConfig), shareReplay(1))

  const maskObservers = {
    main: maskIn$
  }
  const maskObservables = {
    main: maskOutShare$
  }
  const driverMaker = makeBaseDriver(
    () => ofType('main', maskObservers),
    () => ofType('main', maskObservables)
  )
  return {
    observers: maskObservers,
    observables: maskObservables,
    maker: driverMaker,
    driver: driverMaker()
  }
}

export const maskDriverManager = makeBaseScopeManager()

maskDriverManager.registerScope('app', makeMaskDriver())
