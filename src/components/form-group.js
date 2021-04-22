import { html } from '../libs/lit-html.js'
import { makeComponentMaker } from '../helpers/index.js'
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
export const makeFormGroupC = makeComponentMaker({
  prepareSingletonLevelContexts: (options, { useStyles, useActuations }) => {
    // childs are options of form item component or component & related interface itself
    //   -> options of form item component: { name, type, ... }
    //   -> component & related interface: [component, { name, type, schemaIn, schemaOut }]
    const childsRD = useStyles('childs', [])
    const rulesRD = useStyles('rules', [])
    tapValueT('childsRD')(childsRD)
    tapValueT('rulesRD')(rulesRD)

    const schemaOutD = useActuations('schemaOut', {})

    // create component from childs options
    //   -> take: childs
    //   -> return: [{ name, component, interface }, ...]
    const childsToFormItemsM = Mutation.ofLiftLeft(options => {
      return options.map(option => {
        if (isObject(option)) {
          let { marks, styles, actuations, configs } = option
          if (!styles) {
            styles = option
            delete styles.marks
            delete styles.actuations
            delete styles.configs
          }
          const { name, type } = styles

          actuations = actuations || {}
          actuations.schemaIn = actuations.schemaIn || Data.of({})
          actuations.schemaOut = actuations.schemaOut || Data.of({})

          return {
            name,
            component: FORM_ITEM_TYPE_MAP.get(type)({ marks, styles, actuations, configs }),
            interface: { schemaIn: actuations.schemaIn, schemaOut: actuations.schemaOut }
          }
        } else if (isArray(option)) {
          const { name, schemaIn, schemaOut } = option[1]
          return {
            name,
            component: option[0],
            interface: { schemaIn, schemaOut }
          }
        }
      })
    })
    const formItemsRD = replayWithLatest(1, Data.empty())
    pipeAtom(childsRD, childsToFormItemsM, formItemsRD)

    // component in formItemsRD is a Data of Data structure here
    // it needs to be flatted before return as part of SingletonLevelContexts
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

    const interfacesRD = preContextsRD.pipe(pluckT('interfaces'), replayWithLatest(1))
    const schemaOutsRD = interfacesRD.pipe(mapT(interfaces => {
      return Object.entries(interfaces).reduce((acc, [name, value]) => {
        acc[name] = acc[name] || value.schemaOut
        return acc
      }, {})
    }), replayWithLatest(1), mapT(combineLatestT), replayWithLatest(1), withValueFlatted, replayWithLatest(1))

    binaryTweenPipeAtom(schemaOutsRD, schemaOutD)
    tapValueT('schemaOutsRD')(schemaOutsRD)

    return {
      components: componentsRD
    }
  },
  handler: ({ marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts }) => {
    styles = {
      ...styles,
      components: singletonLevelContexts.components
    }

    return html`${Object.values(styles.components)}`
  }
})
