import { Data, replayWithLatest } from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeMiddleColAdaptiveLayoutE } from '../elements/index'

import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export interface MiddleColAdaptiveLayoutDCSingleLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      rootClasses: string
      left: any
      middle: any
      right: any
    }
  }
  _internals: {
    styles: {
      rootClasses: string
      left: any
      middle: any
      right: any
    }
  }
}

/**
 * @param inputs.styles.left - Left element.
 * @param inputs.styles.middle - Middle element.
 * @param inputs.styles.right - Right element.
 */
export const makeMiddleColAdaptiveLayoutDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, MiddleColAdaptiveLayoutDCSingleLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: () => {
    const rootClassesD = Data.empty<string>()
    const rootClassesRD = replayWithLatest(1, rootClassesD)
    const leftD = Data.empty<any>()
    const leftRD = replayWithLatest(1, leftD)
    const middleD = Data.empty<any>()
    const middleRD = replayWithLatest(1, middleD)
    const rightD = Data.empty<any>()
    const rightRD = replayWithLatest(1, rightD)

    return {
      inputs: {
        styles: {
          rootClasses: rootClassesD,
          left: leftD,
          middle: middleD,
          right: rightD
        }
      },
      _internals: {
        styles: {
          rootClasses: rootClassesRD,
          left: leftRD,
          middle: middleRD,
          right: rightRD
        }
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeMiddleColAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeMiddleColAdaptiveLayoutDC}
 */
export const useMiddleColAdaptiveLayoutDC = useGUIDriver_(makeMiddleColAdaptiveLayoutDC)
