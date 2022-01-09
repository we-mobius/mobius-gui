import {
  Data, Mutation,
  makeGeneralEventHandler,
  pipeAtom, binaryTweenPipeAtom,
  convergeT,
  replayWithLatest
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeMaskE } from '../elements/index'

import type { EventHandler } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export interface MaskDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      isShow: boolean
      rootClasses: string
      maskClasses: string
      contentContainerClasses: string
      content: any
    }
    actuations: {
      toggle: any
    }
  }
  _internals: {
    styles: {
      isShow: boolean
      rootClasses: string
      maskClasses: string
      contentContainerClasses: string
      content: any
    }
    actuations: {
      clickHandler: EventHandler<HTMLDivElement>
    }
  }
  outputs: {
    isShow: boolean
  }
}

/**
 *
 */
export const makeMaskDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, MaskDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const isShowD = Data.of(false)
    const isShowRD = replayWithLatest(1, isShowD)
    const contentD = Data.of<any>('')
    const contentRD = replayWithLatest(1, contentD)
    const rootClassesD = Data.of('')
    const rootClassesRD = replayWithLatest(1, rootClassesD)
    const contentContainerClassesD = Data.of('')
    const contentContainerClassesRD = replayWithLatest(1, contentContainerClassesD)
    const maskClassesD = Data.of('')
    const maskClassesRD = replayWithLatest(1, maskClassesD)

    const toggleSignalD = Data.empty<any>()

    const [clickHandlerRD, , clickD] = makeGeneralEventHandler<HTMLDivElement, boolean>(event => false)

    const toggleD: Data<boolean> = convergeT(toggleSignalD, clickD)

    pipeAtom(toggleD, Mutation.ofLiftBoth((_, isShow: boolean) => !isShow), isShowRD)
    binaryTweenPipeAtom(clickD, isShowRD)

    return {
      inputs: {
        styles: {
          isShow: isShowD,
          content: contentD,
          rootClasses: rootClassesD,
          contentContainerClasses: contentContainerClassesD,
          maskClasses: maskClassesD
        },
        actuations: {
          toggle: toggleSignalD
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
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeMaskE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeMaskDC}
 */
export const useMaskDC = useGUIDriver_(makeMaskDC)
