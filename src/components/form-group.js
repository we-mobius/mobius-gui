import { makeTacheFormatComponent, useUITache } from '../helpers/index.js'
import {
  isObject, isArray,
  Data, Mutation,
  replayWithLatest, withValueFlatted,
  pipeAtom, binaryTweenPipeAtom,
  pluckT, mapT, combineLatestT, tapValueT
} from '../libs/mobius-utils.js'
import { FORM_ITEM_TYPE_MAP } from './form.js'

/**
 * @param marks
 * @param styles Object, { name, type, layout, childs, rules }
 * @param actuations Object, { schemaIn, schemaOut }
 * @param configs
 * @return Data of TemplateResult
 */
export const formGroupTC = makeTacheFormatComponent({
  prepareSingletonLevelContexts: (options, { useStyles, useOutputs }) => {
    // childs are options of form item component or component & related interface itself
    //   -> options of form item component: { styles: { name, type, ... }, marks, ... } | { name, type, marks, actuations, ... }
    //   -> component & related interface: [component, { name, type, schemaIn, schemaOut }]
    const childsRD = useStyles('childs', [])
    const rulesRD = useStyles('rules', [])
    tapValueT('childsRD')(childsRD)
    tapValueT('rulesRD')(rulesRD)

    const schemaOutD = useOutputs('schemaOut', {})

    // create component from childs options
    //   -> take: childs
    //   -> return: [{ name, component, interface: { schemaIn, schemaOut } }, ...]
    const childsToFormItemsM = Mutation.ofLiftLeft(childs => {
      return childs.map(child => {
        if (isObject(child)) {
          let { marks, styles, actuations, configs, outputs } = child
          if (!styles) {
            styles = child
            delete styles.marks
            delete styles.actuations
            delete styles.configs
            delete styles.outputs
          }
          const { name, type } = styles

          outputs = outputs || {}
          outputs.schemaIn = outputs.schemaIn || Data.of({})
          outputs.schemaOut = outputs.schemaOut || Data.of({})

          return {
            name,
            component: FORM_ITEM_TYPE_MAP.get(type)({ marks, styles, actuations, configs, outputs }),
            interface: { schemaIn: outputs.schemaIn, schemaOut: outputs.schemaOut }
          }
        } else if (isArray(child)) {
          const { name, schemaIn, schemaOut } = child[1]
          return {
            name,
            component: child[0],
            interface: { schemaIn, schemaOut }
          }
        }
      })
    })
    const formItemsRD = replayWithLatest(1, Data.empty())
    pipeAtom(childsRD, childsToFormItemsM, formItemsRD)

    // component in formItemsRD is a Data of Data structure here
    // it needs to be flatted before return as part of SingletonLevelContexts
    //   -> take: formItems
    //   -> return: { components: { name: component, ... }, interfaces: { name: interface, ... }}
    //     -> where interface -> { schemaIn, schemaOut }
    const formItemsToPreContextsM = Mutation.ofLiftLeft(formItems => {
      return formItems.reduce((acc, formItem) => {
        const { name, component, interface: i } = formItem
        acc.components[name] = component
        acc.interfaces[name] = i
        return acc
      }, { components: {}, interfaces: {} })
    })
    const preContextsRD = replayWithLatest(1, Data.empty())
    pipeAtom(formItemsRD, formItemsToPreContextsM, preContextsRD)

    // pluck components & interfaces seperate
    const wrappedComponentsRD = preContextsRD.pipe(pluckT('components'), replayWithLatest(1))
    const componentsRD = wrappedComponentsRD.pipe(mapT(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))

    const wrappedInterfacesRD = preContextsRD.pipe(pluckT('interfaces'), replayWithLatest(1))
    const schemaInsRD = wrappedInterfacesRD.pipe(mapT(interfaces => {
      return Object.entries(interfaces).reduce((acc, [name, { schemaIn }]) => {
        acc[name] = acc[name] || schemaIn
        return acc
      }, {})
    }), replayWithLatest(1), mapT(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))
    const schemaOutsRD = wrappedInterfacesRD.pipe(mapT(interfaces => {
      return Object.entries(interfaces).reduce((acc, [name, { schemaOut }]) => {
        acc[name] = acc[name] || schemaOut
        return acc
      }, {})
    }), replayWithLatest(1), mapT(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))

    binaryTweenPipeAtom(schemaOutsRD, schemaOutD)
    tapValueT('schemaOutsRD')(schemaOutsRD)

    return {
      components: componentsRD
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs, singletonLevelContexts }, template, mutation, { html }) => {
    styles = {
      ...styles,
      components: singletonLevelContexts.components
    }

    return html`${Object.values(styles.components)}`
  }
})

export const useFormGroupTC = useUITache(formGroupTC)
