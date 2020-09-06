import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs, isFunction } from '../libs/mobius.js'

const pathToCondition = path => path

const hideVNodes = vnodes => {
  vnodes.forEach(vnode => {
    if (vnode.elm) {
      vnode.elm.style.display = 'none'
    }
  })
}
const showVNode = vnode => {
  if (vnode.elm) {
    vnode.elm.style.display = ''
  }
}

const makeRouterVNode = ({ unique, children, config }) => {
  const { persistedPages = [], condition, persisted } = config
  const pageToRender = isFunction(condition) ? condition() : condition
  const isPersist = pagename => persistedPages.includes(pagename)
  const isToRender = pagename => pagename === pageToRender
  children = Object.entries(children).reduce((acc, [name, vnode]) => {
    // console.warn(`本次渲染目标: ${pageToRender}, 持久化列表： ${persistedPages}, 本循环目标: ${name}`)
    if (isPersist(name)) {
      vnode.data.hook = {
        insert: e => {
          // console.warn(`VNode insert: ${name}`, e)
          persisted[name] = e
          e.elm.style.display = isToRender(name) ? '' : 'none'
        },
        update: e => {
          // console.warn(`VNode update: ${name}`, e)
          persisted[name] = e
        }
      }
      acc[name] = vnode
    } else {
      if (isToRender(name)) {
        acc[name] = vnode
      }
    }
    return acc
  }, {})
  hideVNodes(Object.values(persisted))
  if (isPersist(pageToRender) && persisted[pageToRender]) {
    showVNode(persisted[pageToRender])
  }
  return Object.values(children)
}

const makeRouterC = ({
  unique = '', children = {}, componentToDriverMapper = asIs, driver, driverToComponentMapper = pathToCondition, config
}) => {
  const innerConfig = { persisted: {} }
  return makeBaseComponent({
    children: children,
    intent: source => {},
    model: intent$ => driver(),
    view: model$ => {
      const renders$ = model$.pipe(
        map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeRouterVNode({ unique, children: childsDOM, config: { ...innerConfig, ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeRouterVNode({ unique, children: [...childsDOM, ...children], config: { ...innerConfig, ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}

export { makeRouterC }
