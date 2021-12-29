import {
  isPlainObject, isArray, isUndefined,
  isVacuo, TERMINATOR,
  Data, Mutation,
  replayWithLatest, withValueFlatted,
  pipeAtom, binaryTweenPipeAtom,
  pluckT, mapT, combineLatestT, tapValueT
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { FORM_MEMBERS_MAP } from './form'

import type { AnyStringRecord, Terminator, AtomLikeOfOutput } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export type FormGroupDCType = 'FormGroup'
interface FormMemberComponentOptions {
  inputs: {
    marks?: AnyStringRecord
    styles: AnyStringRecord & { name: string, type: string }
    actuations?: AnyStringRecord
    configs?: AnyStringRecord
  }
  outputs?: AnyStringRecord
}
type FormGroupChild = [AtomLikeOfOutput<TemplateResult>, { name: string, type: string, schemaIn: Data<any>, schemaOut: Data<any> }]
type FormGroupDCChilds = Array<FormMemberComponentOptions | FormGroupChild>
type FormGroupDCRules = any[]

interface FormGroupItem {
  name: string
  component: AtomLikeOfOutput<TemplateResult>
  interfaces: { schemaIn: Data<any>, schemaOut: Data<any> }
}

export interface FormGroupDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      schema: any
      type: FormGroupDCType
      name: string
      childs: FormGroupDCChilds
      rules: FormGroupDCRules
    }
  }
  _internals: {
    styles: {
      components: any
    }
  }
  outputs: {
    schema: any
  }
}

/**
 * @param marks
 * @param styles Object, { name, type, layout, childs, rules }
 * @param actuations Object, { schemaIn, schemaOut }
 * @param configs
 * @return driver
 */
export const makeFormGroupDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, FormGroupDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束
    const schemaInD = Data.empty()
    const schemaOutRD = replayWithLatest(1, Data.empty())

    const nameD = Data.of('')
    const typeD = Data.of<FormGroupDCType>('FormGroup')
    const nameRD = replayWithLatest(1, nameD)
    const typeRD = replayWithLatest(1, typeD)
    // childs are options of formMemberComponent or component & related interface itself
    //   -> options of formMemberComponent: { styles: { name, type, ... }, marks, ... }
    //   -> component & related interface: [component, { name, type, schemaIn, schemaOut }]
    const childsD = Data.of<FormGroupDCChilds>([])
    const rulesD = Data.of<FormGroupDCRules>([])
    const childsRD = replayWithLatest(1, childsD)
    const rulesRD = replayWithLatest(1, rulesD)
    tapValueT('childsRD', childsRD)
    tapValueT('rulesRD', rulesRD)

    // create component from childs options
    //   -> take: childs
    //   -> return: [{ name, component, interfaces: { schemaIn, schemaOut } }, ...]
    const childsToFormGroupItemsM = Mutation.ofLiftLeft<FormGroupDCChilds, FormGroupItem[] | Terminator>(childs => {
      if (isVacuo(childs)) return TERMINATOR

      const formGroupMembers = childs.map<FormGroupItem>(child => {
        if (!isPlainObject(child) && !isArray(child)) {
          throw (new TypeError('"child" is expected to be type of "Object" | "Array".'))
        }
        // 预置表单项组件的配置项数据结构为对象
        // 自定义表单项组件的配置项数据结构为数组
        if (isArray(child)) {
          const { name, schemaIn, schemaOut } = child[1]
          return {
            name,
            component: child[0],
            interfaces: { schemaIn, schemaOut }
          }
        } else if (isPlainObject(child)) {
          // driverComponent 的配置项数据结构为: { inputs, outputs, ... }
          if (isUndefined(child.inputs)) {
            throw (new TypeError('"inputs" field is required for driverComponent\'s options.'))
          }

          // 解析 driverComponent 的配置
          const { inputs, outputs = {} } = child

          if (isUndefined(inputs.styles)) {
            throw (new TypeError('"inputs.styles" field is required for driverComponent\'s options.'))
          }

          const { name, type } = inputs.styles

          if (isUndefined(name) || isUndefined(type)) {
            throw (new TypeError('Both "name" and "type" option is required for formGroupMemberComponent.'))
          }

          inputs.styles.schema = inputs.styles.schema ?? Data.of({})
          outputs.schema = outputs.schame ?? Data.of({})

          const derivedGUIDriverUse = FORM_MEMBERS_MAP.get(type)

          if (isUndefined(derivedGUIDriverUse)) {
            throw (new TypeError(`"${type}" is not a valid formGroupMemberComponent type.`))
          }

          const driverComponentInstance = derivedGUIDriverUse({})({ inputs, outputs })

          return {
            name,
            component: driverComponentInstance?.outputs?.template,
            interfaces: { schemaIn: driverComponentInstance?.inputs?.styles.schema, schemaOut: driverComponentInstance?.outputs?.schema }
          }
        } else {
          throw (new TypeError('Unexpected error occurred.'))
        }
      })

      return formGroupMembers
    })
    const formGroupItemsRD = replayWithLatest(1, Data.empty<FormGroupItem[]>())
    pipeAtom(childsRD, childsToFormGroupItemsM, formGroupItemsRD)

    // component in formGroupItemsRD is a Data of Data structure here
    // it needs to be flatted before return as part of SingletonLevelContexts
    //   -> take: formGroupItems
    //   -> return: { components: { name: component, ... }, interfaces: { name: interfaces, ... }}
    //     -> where interfaces -> { schemaIn, schemaOut }
    interface PreContexts {
      components: Record<string, AtomLikeOfOutput<TemplateResult>>
      interfaces: Record<string, { schemaIn: Data<any>, schemaOut: Data<any> }>
    }
    const formGroupItemsToPreContextsM = Mutation.ofLiftLeft<FormGroupItem[], PreContexts | Terminator>(formGroupItems => {
      if (isVacuo(formGroupItems)) return TERMINATOR

      return formGroupItems.reduce<PreContexts>((acc, formItem) => {
        const { name, component, interfaces } = formItem
        acc.components[name] = component
        acc.interfaces[name] = interfaces
        return acc
      }, { components: {}, interfaces: {} })
    })
    const preContextsRD = replayWithLatest(1, Data.empty<PreContexts>())
    pipeAtom(formGroupItemsRD, formGroupItemsToPreContextsM, preContextsRD)

    // pluck components & interfaces seperate
    const wrappedComponentsRD = replayWithLatest(1, pluckT<PreContexts, PreContexts['components']>('components', preContextsRD))
    const componentsRD = replayWithLatest(1, withValueFlatted(replayWithLatest(1, mapT(combineLatestT, wrappedComponentsRD))))
    // const componentsRD = wrappedComponentsRD.pipe(mapT_(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))

    const wrappedInterfacesRD = replayWithLatest(1, pluckT<PreContexts, PreContexts['interfaces']>('interfaces', preContextsRD))

    // formGroup 的 schemaInD 分解之后对接给各个 formItemComponent 的 schemaIn
    // TODO: 待完善
    const schemaInsD = mapT(interfaces => {
      return Object.entries(interfaces).reduce<Record<string, Data<any>>>((acc, [name, { schemaIn }]) => {
        acc[name] = acc[name] ?? schemaIn
        return acc
      }, {})
    }, wrappedInterfacesRD)
    const schemaInsRD = replayWithLatest(1, withValueFlatted(replayWithLatest(1, mapT(combineLatestT, replayWithLatest(1, schemaInsD)))))

    // 各个 formItemComponent 的 schemaOut 汇总成 formGroup 的 schemaOut
    const schemaOutD = mapT(interfaces => {
      return Object.entries(interfaces).reduce<Record<string, Data<any>>>((acc, [name, { schemaOut }]) => {
        acc[name] = acc[name] ?? schemaOut
        return acc
      }, {})
    }, wrappedInterfacesRD)
    const _schemaOutRD = replayWithLatest(1, withValueFlatted(replayWithLatest(1, mapT(combineLatestT, replayWithLatest(1, schemaOutD)))))
    // const _schemaOutRD = wrappedInterfacesRD.pipe(mapT_(interfaces => {
    //   return Object.entries(interfaces).reduce((acc, [name, { schemaOut }]) => {
    //     acc[name] = acc[name] || schemaOut
    //     return acc
    //   }, {})
    // }), replayWithLatest(1), mapT_(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))
    binaryTweenPipeAtom(_schemaOutRD, schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          name: nameD,
          type: typeD,
          childs: childsD,
          rules: rulesD
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
    const { components } = styles
    return !isUndefined(components) ? html`${Object.values(styles.components)}` : html``
  }
})

/**
 * @see {@link makeFormGroupDC}
 */
export const useFormGroupDC = useGUIDriver_(makeFormGroupDC)
