import { isArray, isObject, hasOwnProperty, isFunction } from '../libs/mobius.js'
import { combineLatest, map, of } from '../libs/rx.js'

// TODO: 优化
const isComponent = item => {
  // 压缩代码的情况下不要使用 constructor.name 检测
  // return item.DOM && item.DOM.constructor.name === 'Observable'
  return item.DOM && isFunction(item.DOM.subscribe)
}
const isElement = item => hasOwnProperty('sel', item) && hasOwnProperty('elm', item)
const childrenToDOMs = children => combineLatest(...children.map(child => isComponent(child) ? child.DOM : of(child)))

// NOTE: 此处参数默认值只为提供编辑提示，并不完全等同于切实签名
const makeBaseComponent = ({ children = null, intent, model, view } = {
  children: null,
  intent: source => {},
  model: intent$ => {},
  view: model$ => {}
}) => {
  let childrenDOMs$ = null
  if (children) {
    // 此处：Array 检测一定要在 Object 检测前面，且一定要使用 eles if
    if (isArray(children)) {
      childrenDOMs$ = childrenToDOMs(children)
    } else if (isObject(children) && !isElement(children)) {
      const childrenDOM$s = {}
      Object.keys(children).forEach(key => {
        const item = children[key]
        if (isArray(item)) {
          childrenDOM$s[key] = childrenToDOMs(item).pipe(
            map(DOMs => {
              DOMs.mobiusComponentSlotFlag = key
              return DOMs
            })
          )
        } else if (isComponent(item)) {
          childrenDOM$s[key] = item.DOM.pipe(
            map(vnode => {
              vnode.mobiusComponentSlotFlag = key
              return vnode
            })
          )
        } else {
          childrenDOM$s[key] = of({ value: item, key: key })
        }
      })
      childrenDOMs$ = combineLatest(...Object.values(childrenDOM$s)).pipe(
        map(([...items]) => items.reduce((accDOMs, curItem) => {
          if (isArray(curItem) || isElement(curItem)) {
            // NOTE: combine 的 observables 只有部分更新的时候，未更新的其它结果都是缓存
            //   -> 故此时执行 delete vnode.mobiusComponentSlotFlag 并不合适
            accDOMs[curItem.mobiusComponentSlotFlag] = curItem
          } else {
            accDOMs[curItem.key] = curItem.value
          }
          return accDOMs
        }, {}))
      )
    } else {
      childrenDOMs$ = combineLatest(of(children))
    }
  }

  return source => {
    const intent$ = intent(source)
    const model$ = childrenDOMs$ ? combineLatest(model(intent$), childrenDOMs$) : combineLatest(model(intent$))
    const sinks = view(model$)
    return sinks
  }
}

export { makeBaseComponent }
