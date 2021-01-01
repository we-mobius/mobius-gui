import { iframe, div } from '../libs/dom.js'
import { makeUniqueSelector, makeCustomEvent } from '../common/element.common.js'
import { stdLineLog, hardDeepMerge } from '../libs/mobius-utils.js'

const initEventProxy = makeUnique => {
  const iframeElm = document.querySelector(makeUnique('iframe'))
  const eventProxyElm = document.querySelector(makeUnique('event-proxy'))
  iframeElm.addEventListener('load', e => {
    const location = e.target.contentWindow.location
    eventProxyElm.dispatchEvent(makeCustomEvent('loaded', { window: e.target.contentWindow, location }))
  })
}

const handleRefresh = (() => {
  const _sig = ['IframeElement', 'handleRefresh']
  const status = {
    prev: '',
    cur: ''
  }
  return (makeUnique, src) => {
    const iframeElm = document.querySelector(makeUnique('iframe'))
    console.log(stdLineLog(..._sig, 'pre status'), status)
    if (status.cur === src) {
      iframeElm.contentWindow.location.reload()
    } else {
      status.prev = status.cur
      status.cur = src
    }
    console.log(stdLineLog(..._sig, 'cur status'), status)
  }
})()

export const makeIframeE = elementOptions => {
  const { unique, selector = '', props = {}, children = [], config = {} } = elementOptions

  const { src } = config

  const makeUnique = makeUniqueSelector(unique)
  handleRefresh(makeUnique, src)

  return div(
    `${makeUnique('')}${selector}.mobius-scroll-hidden`,
    [
      iframe(
        `${makeUnique('iframe')}.mobius-size--fullpct`,
        hardDeepMerge(props, {
          props: { src: src }
        })
      ),
      div(
        `${makeUnique('event-proxy')}.mobius-display--none`,
        {
          hook: {
            insert: () => {
              initEventProxy(makeUnique)
            }
          }
        }
      )
    ]
  )
}
