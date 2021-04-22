import { makeComponentMaker } from '../helpers/index.js'
import { makeMaskE } from '../elements/index.js'
import {
  Mutation,
  makeGeneralEventHandler,
  pipeAtom, binaryTweenPipeAtom,
  mergeT, tapValueT
} from '../libs/mobius-utils.js'

/**
 * @param marks
 * @param styles Object, { mask, container, isShow, content }
 * @param actuations
 * @param configs
 * @return Data of TemplateResult
 */
export const makeMaskC = makeComponentMaker({
  prepareSingletonLevelContexts: (_, { useStyles, useActuations }) => {
    const externalToggleRD = useActuations('toggle', {})

    const [clickHandlerRD, , clickD] = makeGeneralEventHandler(e => false)

    const toggleD = mergeT(externalToggleRD, clickD)

    const isShowRD = useStyles('isShow', false)
    pipeAtom(toggleD, Mutation.ofLiftBoth((_, isShow) => !isShow), isShowRD)
    binaryTweenPipeAtom(clickD, isShowRD)

    return {
      isShow: isShowRD,
      clickHandler: clickHandlerRD
    }
  },
  handler: ({ marks, styles, actuations, configs, singletonLevelContexts }) => {
    styles = {
      ...styles,
      isShow: singletonLevelContexts.isShow
    }
    actuations = {
      ...actuations,
      clickHandler: singletonLevelContexts.clickHandler
    }

    return makeMaskE({ marks, styles, actuations, configs })
  }
})
