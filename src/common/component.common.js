import { isArray, isObject, hasOwnProperty, isFunction } from '../libs/mobius-utils.js'
import { combineLatest, map, of, isObservable } from '../libs/rx.js'

// TODO: 优化
const isComponent = item => {
  // 压缩代码的情况下不要使用 constructor.name 检测
  // return item.DOM && item.DOM.constructor.name === 'Observable'
  return item.DOM && isFunction(item.DOM.subscribe)
}
const isElement = item => hasOwnProperty('sel', item) && hasOwnProperty('elm', item)
const childrenToDOMs = children => combineLatest([...children.map(child => isComponent(child) ? child.DOM : of(child))])

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
      childrenDOMs$ = combineLatest(Object.values(childrenDOM$s)).pipe(
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
      childrenDOMs$ = combineLatest([of(children)])
    }
  }

  return source => {
    // intent 可以是一个接受 source，什么都不返回的函数（默认）
    // intent 可以是一个接受 source，返回单一 Observable 的函数
    // intent 可以是一个接受 source，返回对象形式的一组 Observable 的函数
    // intent 可以是对象形式的一组接受 source 返回单一 Observable 的函数
    let intent$
    if (isFunction(intent)) {
      intent$ = intent(source)
    } else if (isObject(intent)) {
      intent$ = Object.entries(intent).reduce((acc, [key, intent]) => {
        acc[key] = intent(source)
        return acc
      }, {})
    }
    // 以上处理之后返回单一 Observable 或者对象形式的一组 Observable 或者 undefined

    // Component 使用时接受的 driver 可以是单个 driver，也可以是对象形式的一组 driver
    // model 可以是接受单一 Observable，返回单一 Observable 或者对象形式的一组 Observable 的函数
    // model 可以是接受对象形式的一组 Observable，返回对象形式的一组 Observable 或者单一 Observable 的函数，
    // model 可以是对象形式的一组函数，此时如果 intent 返回单一 Observable，这个 Observable 会被 applyTo 所有 model
    let model$
    if (isFunction(model)) {
      if (isObservable(intent$)) {
        model$ = model(intent$)
      } else if (isObject(intent$)) {
        // TODO: 完善判断机制
        try {
          model$ = model(intent$)
        } catch (error) {
          model$ = Object.entries(intent$).reduce((acc, [key, intent$]) => {
            acc[key] = model(intent$)
            return acc
          }, {})
        }
      } else {
        // 当 Component 没有 intent 时，intent$ 为 undefined
        model$ = model()
      }
    } else if (isObject(model)) {
      // NOTE: order of isObservable & isObject matters
      if (isObservable(intent$)) {
        model$ = Object.entries(model).reduce((acc, [key, model]) => {
          acc[key] = model(intent$)
          return acc
        }, {})
      } else if (isObject(intent$)) {
        model$ = Object.entries(model).reduce((acc, [key, model]) => {
          // 此处不必担心， intent$[key] === undefined
          // model 内部会执行 driver， intent$ 会作为 driver 的入参，driver 会做真假判断
          acc[key] = model(intent$[key])
          return acc
        }, {})
      }
    }
    // 以上处理之后返回单一 Observable 或者对象形式的一组 Observable

    let sinks
    // NOTE: order of isObservable & isObject matters
    if (isObservable(model$)) {
      sinks = view(childrenDOMs$ ? combineLatest([model$, childrenDOMs$]) : model$.pipe(map(val => ([val]))))
    } else if (isObject(model$)) {
      sinks = view(model$, childrenDOMs$ || of(null))
    }
    return sinks
  }
}

export { makeBaseComponent }
