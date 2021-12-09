import { makeDriverFormatComponent, useUIDriver } from '../helpers/index'
import {
  isObject, isArray,
  Data, Mutation,
  replayWithLatest, withValueFlatted,
  pipeAtom, binaryTweenPipeAtom,
  pluckT_, mapT_, combineLatestT, tapValueT
} from '../libs/mobius-utils'
import { FORM_ITEM_MAP } from './form'

/**
 * @param marks
 * @param styles Object, { name, type, layout, childs, rules }
 * @param actuations Object, { schemaIn, schemaOut }
 * @param configs
 * @return driver
 */
export const formGroupDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束
    const schemaInD = Data.empty()
    const schemaOutRD = replayWithLatest(1, Data.empty())

    // childs are options of formItemComponent or component & related interface itself
    //   -> options of formItemComponent: { styles: { name, type, ... }, marks, ... }
    //   -> component & related interface: [component, { name, type, schemaIn, schemaOut }]
    const childsInD = Data.empty()
    const rulesInD = Data.empty()
    const childsRD = replayWithLatest(1, Data.of([]))
    const rulesRD = replayWithLatest(1, Data.of([]))
    binaryTweenPipeAtom(childsInD, childsRD)
    binaryTweenPipeAtom(rulesInD, rulesRD)
    tapValueT('childsRD', childsRD)
    tapValueT('rulesRD', rulesRD)

    // create component from childs options
    //   -> take: childs
    //   -> return: [{ name, component, interfaces: { schemaIn, schemaOut } }, ...]
    const childsToFormItemsM = Mutation.ofLiftLeft(childs => {
      return childs.map(child => {
        if (!isObject(child) && !isArray(child)) {
          throw (new TypeError('"child" is expected to be type of "Object" | "Array".'))
        }
        // 预置表单项组件的配置项数据结构为对象
        // 自定义表单项组件的配置项数据结构为数组
        if (isObject(child)) {
          // tacheComponent 的配置项数据结构为：{ styles, outputs, ... }
          // driverComponent 的配置项数据结构为: { inputs, outputs, ... }
          if (!child.styles && !child.inputs) {
            throw (new TypeError('"child" is expected to be options of tacheComponent or driverComponent.'))
          }

          if (child.styles) {
            // 解析 tacheComponent 的配置项
            const { marks, styles, actuations, configs, outputs = {} } = child
            const { name, type } = styles

            if (!name || !type) {
              throw (new TypeError('Both "name" and "type" option is required for formItemComponent.'))
            }

            styles.schema = styles.schema || Data.of({})
            outputs.schema = outputs.schema || Data.of({})

            return {
              name,
              component: FORM_ITEM_MAP.get(type)()({ marks, styles, actuations, configs, outputs }),
              interfaces: { schemaIn: styles.schema, schemaOut: outputs.schema }
            }
          } else if (child.inputs) {
            // 解析 driverComponent 的配置
            const { inputs, outputs = {} } = child

            if (!inputs.styles) {
              throw (new TypeError('"styles" option is required for driverComponent.'))
            }

            const { name, type } = inputs.styles

            if (!name || !type) {
              throw (new TypeError('Both "name" and "type" option is required for formItemComponent.'))
            }

            inputs.styles.schema = inputs.styles.schema || Data.of({})
            outputs.schema = outputs.schame || Data.of({})

            const driverComponentInstance = FORM_ITEM_MAP.get(type)()({ inputs, outputs })

            return {
              name,
              component: driverComponentInstance.outputs.template,
              interfaces: { schemaIn: driverComponentInstance.inputs.styles.schema, schemaOut: driverComponentInstance.outputs.schema }
            }
          }
        } else if (isArray(child)) {
          const { name, schemaIn, schemaOut } = child[1]
          return {
            name,
            component: child[0],
            interfaces: { schemaIn, schemaOut }
          }
        }
      })
    })
    const formItemsRD = replayWithLatest(1, Data.empty())
    pipeAtom(childsRD, childsToFormItemsM, formItemsRD)

    // component in formItemsRD is a Data of Data structure here
    // it needs to be flatted before return as part of SingletonLevelContexts
    //   -> take: formItems
    //   -> return: { components: { name: component, ... }, interfaces: { name: interfaces, ... }}
    //     -> where interfaces -> { schemaIn, schemaOut }
    const formItemsToPreContextsM = Mutation.ofLiftLeft(formItems => {
      return formItems.reduce((acc, formItem) => {
        const { name, component, interfaces } = formItem
        acc.components[name] = component
        acc.interfaces[name] = interfaces
        return acc
      }, { components: {}, interfaces: {} })
    })
    const preContextsRD = replayWithLatest(1, Data.empty())
    pipeAtom(formItemsRD, formItemsToPreContextsM, preContextsRD)

    // pluck components & interfaces seperate
    const wrappedComponentsRD = preContextsRD.pipe(pluckT_('components'), replayWithLatest(1))
    const componentsRD = wrappedComponentsRD.pipe(mapT_(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))

    const wrappedInterfacesRD = preContextsRD.pipe(pluckT_('interfaces'), replayWithLatest(1))

    // formGroup 的 schemaInD 分解之后对接给各个 formItemComponent 的 schemaIn
    // TODO: 待完善
    const schemaInsRD = wrappedInterfacesRD.pipe(mapT_(interfaces => {
      return Object.entries(interfaces).reduce((acc, [name, { schemaIn }]) => {
        acc[name] = acc[name] || schemaIn
        return acc
      }, {})
    }), replayWithLatest(1), mapT_(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))

    // 各个 formItemComponent 的 schemaOut 汇总成 formGroup 的 schemaOut
    const _schemaOutRD = wrappedInterfacesRD.pipe(mapT_(interfaces => {
      return Object.entries(interfaces).reduce((acc, [name, { schemaOut }]) => {
        acc[name] = acc[name] || schemaOut
        return acc
      }, {})
    }), replayWithLatest(1), mapT_(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))
    binaryTweenPipeAtom(_schemaOutRD, schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          childs: childsInD,
          rules: rulesInD
        }
      },
      _internals: {
        styles: {
          components: componentsRD
        }
      },
      outputs: {
        schema: schemaOutRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, { html }) => {
    return styles.components ? html`${Object.values(styles.components)}` : ''
  }
})

export const useFormGroupDC = useUIDriver(formGroupDC)
