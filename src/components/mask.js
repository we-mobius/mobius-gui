import { makeComponentMaker } from '../helpers/index.js'
import { makeMaskE } from '../elements/index.js'
import {
  Data, replayWithLatest,
  createDataWithReplay,
  makeGeneralEventHandler,
  binaryTweenPipeAtom,
  tapValueT
} from '../libs/mobius-utils.js'

export const makeMaskC = makeComponentMaker({
  prepareSingletonLevelContexts: (_, { useStyles }) => {
    const [clickHandlerRD, , clickD] = makeGeneralEventHandler(e => false)

    const isShowRD = useStyles('isShow', false, { isDistinct: false })
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
