import { div } from '../libs/dom.js'
import { makeUniqueSelector, makeCustomEvent } from '../common/element.common.js'
import { hardDeepMerge } from 'MobiusUtils'

// 实例化完成之后触发 instantialized 事件
const initMonaco = (makeUnique, initializer) => {
  const eventProxyEle = document.querySelector(makeUnique('event-proxy'))
  const containerEle = document.querySelector(makeUnique('container'))
  const monacoInstance = initializer(containerEle)
  const makeInstantializedEvent = instance => makeCustomEvent('instantialized', { instance })
  eventProxyEle.dispatchEvent(makeInstantializedEvent(monacoInstance))
}
// DOM inserted 之后触发 ready 事件，同时注册点击触发 load 事件的机制
const initReadyEvent = makeUnique => {
  const eventProxyEle = document.querySelector(makeUnique('event-proxy'))
  const makeReadyEvent = () => makeCustomEvent('ready')
  eventProxyEle.dispatchEvent(makeReadyEvent())

  const makeLoadEvent = () => makeCustomEvent('load')
  const containerEle = document.querySelector(makeUnique('container'))
  containerEle.addEventListener('click', () => {
    eventProxyEle.dispatchEvent(makeLoadEvent())
  })
}

export const makeMonacoEditorE = elementOptions => {
  const { unique, selector = '', props = {}, children = [], config = {} } = elementOptions

  // NOTE: initializer 只接受一个参数，即容器元素
  const { initializer } = config
  const makeUnique = makeUniqueSelector(unique)
  // TODO: if there is no initializer provided, show a default view instead
  if (initializer) {
    initMonaco(makeUnique, initializer)
  }

  return div(
    `${makeUnique('')}${selector}`,
    [
      div(
        `${makeUnique('container')}.mobius-size--fullpct`,
        hardDeepMerge(props, {
          hook: {
            insert: () => {
              initReadyEvent(makeUnique)
            }
          }
        })
      ),
      div(`${makeUnique('event-proxy')}.mobius-display--none`)
    ]
  )
}
