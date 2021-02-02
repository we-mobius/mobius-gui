import { makeBaseDriverMaker } from '../common/index.js'
import { shareReplay, startWith } from '../libs/rx.js'
import { defaultMaskElementConfig } from '../elements/mask.element.js'
import { makeBaseRepository, ofType, makeBaseScopeManager } from '../libs/mobius-js.js'

export const makeMaskDriver = () => {
  const [maskIn$, maskOut$] = makeBaseRepository().array
  const maskOutShare$ = maskOut$.pipe(startWith(defaultMaskElementConfig), shareReplay(1))

  const observers = {
    main: maskIn$
  }
  const observables = {
    main: maskOutShare$
  }
  const driverMaker = makeBaseDriverMaker(
    () => ofType('main', observers),
    () => ofType('main', observables)
  )
  return {
    observers: observers,
    observables: observables,
    maker: driverMaker,
    driver: driverMaker()
  }
}

export const maskDriverManager = makeBaseScopeManager({ maker: makeMaskDriver })

maskDriverManager.registerScope('app', makeMaskDriver())
