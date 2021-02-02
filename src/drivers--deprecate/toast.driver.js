import { makeBaseDriverMaker } from '../common/index.js'
import { shareReplay, startWith, scan, switchMap, of, delay } from '../libs/rx.js'
import {
  makeBaseRepository, ofType, makeBaseScopeManager
} from '../libs/mobius-js.js'
import { hardDeepMerge, deepCopy } from '../libs/mobius-utils.js'

const defaultToastConfig = { isShow: false, hasMask: true, hideOnClick: false, duration: 0, maskConfig: { style: 'transparent' } }

export const makeToastDriver = () => {
  const [toastIn$, toastOut$] = makeBaseRepository().array
  const toastOutShare$ = toastOut$.pipe(
    switchMap(config => {
      const { isShow, duration } = config
      return isShow && duration > 0 ? of({ isShow: false }).pipe(delay(duration), startWith(config)) : of(config)
    }),
    scan((acc, cur) => {
      // NOTE: 隐藏之后重置
      return cur.isShow ? hardDeepMerge(acc, cur) : deepCopy(defaultToastConfig)
    }, deepCopy(defaultToastConfig)),
    startWith(defaultToastConfig),
    shareReplay(1)
  )

  const observers = {
    main: toastIn$
  }
  const observables = {
    main: toastOutShare$
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

export const toastDriverManager = makeBaseScopeManager({ maker: makeToastDriver })

toastDriverManager.registerScope('app', makeToastDriver())
