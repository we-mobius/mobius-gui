import { makeContainerE } from '../elements/container.element.js'
import { makeBaseComponent } from '../common/component.common.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeVNode = ({ unique, children, config }) => {
  return makeContainerE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: { ...config }
  })
}

export const makeCustomC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    // Component 使用时接受的 componentToDriverMapper 可以是单个 mapper function，也可以是对象形式的一组 mapper function
    // intent 可以是一个接受 source，什么都不返回的函数
    // intent 可以是一个接受 source，返回单一 Observable 的函数
    // intent 可以是一个接受 source，返回对象形式的一组 Observable 的函数
    // intent 可以是对象形式的一组接受 source 返回单一 Observable 的函数
    intent: source => {
      // container component do not have any intent
    },
    // Component 使用时接受的 driver 可以是单个 driver，也可以是对象形式的一组 driver
    // driver 应该有处理 undefined 入参的能力
    // model 可以是接受单一 Observable，返回单一 Observable 或者对象形式的一组 Observable 的函数
    // model 可以是接受对象形式的一组 Observable，返回对象形式的一组 Observable 或者单一 Observable 的函数，
    // model 可以是对象形式的一组函数，此时如果 intent 返回单一 Observable，这个 Observable 会被 applyTo 所有 model
    model: intent$ => driver(intent$),
    // Component 使用时接受的 driverToComponentMapper 可以是单个 mapper function，也可以是对象形式的一组 mapper function
    // view 可以是处理一个 Observable ，返回规范化 VNode 的函数
    // view 可以是接受对象形式的一组 Observable 和 childsDOM Observable，返回规范化 VNode 的函数
    // 具体是哪种需要由开发者根据 intent 和 model 推断
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}
