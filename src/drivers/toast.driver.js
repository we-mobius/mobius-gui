import { makeBaseDriver } from '../common/index.js'
import { shareReplay, startWith, scan, switchMap, of, delay } from '../libs/rx.js'
import {
  hardDeepMerge, deepCopy,
  makeBaseRepository, ofType, makeBaseScopeManager
} from '../libs/mobius.js'

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

  const toastObservers = {
    main: toastIn$
  }
  const toastObservables = {
    main: toastOutShare$
  }
  const driverMaker = makeBaseDriver(
    () => ofType('main', toastObservers),
    () => ofType('main', toastObservables)
  )
  return {
    observers: toastObservers,
    observables: toastObservables,
    maker: driverMaker,
    driver: driverMaker()
  }
}

export const toastDriverManager = makeBaseScopeManager()

toastDriverManager.registerScope('app', makeToastDriver())
