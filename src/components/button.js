import { makeTacheFormatComponent, useUITache } from '../helpers/index.js'
import { makeButtonE } from '../elements/index.js'
import {
  makeGeneralEventHandler,
  binaryTweenPipeAtom,
  switchT,
  tapValueT
} from '../libs/mobius-utils.js'

/**
 * @param marks
 * @param styles Object
 * @param actuations
 * @param configs
 * @return Data of TemplateResult
 */
export const buttonTC = makeTacheFormatComponent({
  prepareSingletonLevelContexts: ({ styles }, { useOutputs }) => {
    const schemaOutD = useOutputs('schemaOut', {})

    const externalConfirmRD = useOutputs('confirm', {})

    const [clickHandlerRD, , clickD] = makeGeneralEventHandler()
    binaryTweenPipeAtom(clickD, externalConfirmRD)

    binaryTweenPipeAtom(switchT(styles, clickD), schemaOutD)

    return {
      clickHandler: clickHandlerRD
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs, outputs, singletonLevelContexts }, template, mutation, contexts) => {
    actuations = {
      ...actuations,
      clickHandler: singletonLevelContexts.clickHandler
    }

    return makeButtonE({ marks, styles, actuations, configs })
  }
})

export const useButtonTC = useUITache(buttonTC)
