import { stdLineLog } from '../libs/mobius-utils.js'
import { makeBaseDriverMaker } from '../common/index.js'
import {
  ofType, makeBaseScopeManager
} from '../libs/mobius-js.js'
import {
  Subject, of, EMPTY, merge,
  map, tap, startWith, switchMap, switchMapTo, pairwise, withLatestFrom,
  take,
  shareReplay
} from '../libs/rx.js'

export const makeBrowserlikeIframeDriver = ({
  url = '',
  src = 'https://developer.mozilla.org/',
  placeholder = 'Enter web address, e.g., https://www.example.com/'
} = {}) => {
  const _sig = ['BrowserlikeIframeDriver', 'makeBrowserlikeIframeDriver']
  const defaultStatus = { url, src }

  const eventIn$ = {
    next: detail => {
      const { eventType } = detail
      if (eventType === 'refresh') { _refreshEventMid$.next({}) }
      if (eventType === 'homepage') { _homepageEventMid$.next({}) }
      if (eventType === 'url') {
        let { value: url } = detail
        url = (/^https?:\/\/.*/i).test(url) ? url : `https://${url}`
        _urlEventOutMid$.next({ url: url, src: url })
      }
      if (eventType === 'loaded') {
        _loadedEventMid$.next({ href: detail.location.href })
        _windowOutMid$.next({ window: detail.window })
      }
    },
    error: () => {},
    complete: () => {}
  }
  const _urlEventOutMid$ = new Subject()
  const urlEventOut$ = _urlEventOutMid$.pipe(
    startWith({}, defaultStatus),
    pairwise(),
    shareReplay(1)
  )

  // refresh
  const _refreshEventMid$ = new Subject()
  const refreshEvent$ = _refreshEventMid$.pipe(switchMapTo(urlEventOut$.pipe(take(1))), map(pair => pair[1]))

  // homepage
  const _homepageEventMid$ = new Subject()
  const homepageEvent$ = _homepageEventMid$.pipe(switchMap(() => {
    // NOTE: 要通过 urlEventOut$ 发送新的状态，否则会影响到 refresh 的逻辑
    // refresh 刷新依赖于 urlEventOut$，homepage 的状态应该记录在 urlEventOut$ 中
    _urlEventOutMid$.next(defaultStatus)
    return EMPTY
  }))

  // iframe 在页面加载完成之后，要将实际的 location.href 反馈给 driver，driver 将其同步到 url input box 中
  //   -> 避免陷入死循环，只有当前 href 不同于上一次 href 的时候才 emit 值
  //   -> 当 iframe 展示的是首页的时候，url box 不显示 url（所有的 status 走的都是 urlEventOut$ 通道，检测该通道上次的值即可）
  const _loadedEventMid$ = new Subject()
  const loadedEvent$ = _loadedEventMid$.pipe(
    pairwise(),
    switchMap(pair => {
      const [prev, cur] = pair
      if (prev.href === cur.href) {
        return EMPTY
      } else {
        return of(cur).pipe(withLatestFrom(urlEventOut$.pipe(take(1))))
      }
    }),
    map(([{ href }, pair]) => ({ url: pair[1].url ? href : pair[1].url, src: href })),
    switchMap(status => {
      _urlEventOutMid$.next(status)
      return EMPTY
    })
  )

  const eventOutShare$ = merge(urlEventOut$.pipe(map(pair => pair[1])), refreshEvent$, homepageEvent$, loadedEvent$).pipe(
    tap(res => { console.log(stdLineLog(..._sig, 'event Observable emits'), res) }),
    shareReplay(1)
  )

  const _windowOutMid$ = new Subject()
  const windowOut$ = _windowOutMid$
  const windowOutShare$ = windowOut$.pipe(shareReplay(1))
  windowOutShare$.subscribe(() => {})

  const placeholderIn$ = {
    next: placeholder => {

    },
    error: () => {},
    complete: () => {}
  }
  const _placeholderOutMid$ = new Subject()
  const placeholderOut$ = _placeholderOutMid$.pipe(startWith({ placeholder }))

  const placeholderOutShare$ = placeholderOut$.pipe(shareReplay(1))

  const observers = {
    event: eventIn$,
    placeholder: placeholderIn$
  }
  const observables = {
    event: eventOutShare$,
    placeholder: placeholderOutShare$,
    window: windowOutShare$
  }

  const makeEventDriver = makeBaseDriverMaker(
    () => ofType('event', observers),
    () => ofType('event', observables)
  )

  const makePlaceholderDriver = makeBaseDriverMaker(
    () => ofType('placeholder', observers),
    () => ofType('placeholder', observables)
  )

  const makeWindowDriver = makeBaseDriverMaker(
    () => null,
    () => ofType('window', observables)
  )

  return {
    observers,
    observables,
    maker: {
      event: makeEventDriver,
      placeholder: makePlaceholderDriver,
      window: makeWindowDriver
    },
    driver: {
      event: makeEventDriver(),
      placeholder: makePlaceholderDriver(),
      window: makeWindowDriver()
    }
  }
}

export const browserlikeIframeDriverManager = makeBaseScopeManager({ maker: makeBrowserlikeIframeDriver })
browserlikeIframeDriverManager.registerScope('app', makeBrowserlikeIframeDriver())
