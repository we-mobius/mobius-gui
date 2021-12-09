import { makeDriverFormatComponent, useUIDriver } from '../helpers/index'
import { makeMaskE } from '../elements/index'
import {
  Data, Mutation,
  makeGeneralEventHandler,
  pipeAtom, binaryTweenPipeAtom,
  convergeT,
  replayWithLatest
} from '../libs/mobius-utils'

/**
 * @param marks
 * @param styles Object, { mask, container, isShow, content }
 * @param actuations
 * @param configs
 * @return Data of TemplateResult
 */
export const maskDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const externalToggleD = Data.empty()
    const isShowRD = replayWithLatest(1, Data.of(false))
    const contentRD = replayWithLatest(1, Data.of(''))
    const rootClassesRD = replayWithLatest(1, Data.of(''))
    const contentContainerClassesRD = replayWithLatest(1, Data.of(''))
    const maskClassesRD = replayWithLatest(1, Data.of(''))

    const [clickHandlerRD, , clickD] = makeGeneralEventHandler(e => false)

    const toggleD = convergeT(externalToggleD, clickD)

    pipeAtom(toggleD, Mutation.ofLiftBoth((_, isShow) => !isShow), isShowRD)
    binaryTweenPipeAtom(clickD, isShowRD)

    return {
      inputs: {
        styles: {
          isShow: isShowRD,
          content: contentRD,
          rootClasses: rootClassesRD,
          contentContainerClasses: contentContainerClassesRD,
          maskClasses: maskClassesRD
        },
        actuations: {
          toggle: externalToggleD
        }
      },
      _internals: {
        styles: {
          isShow: isShowRD,
          content: contentRD,
          rootClasses: rootClassesRD,
          contentContainerClasses: contentContainerClassesRD,
          maskClasses: maskClassesRD
        },
        actuations: {
          clickHandler: clickHandlerRD
        }
      },
      outputs: {
        isShow: isShowRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeMaskE({ marks, styles, actuations, configs })
  }
})

export const useMaskDC = useUIDriver(maskDC)
