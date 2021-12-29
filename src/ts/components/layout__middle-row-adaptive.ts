import { Data, replayWithLatest } from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeMiddleRowAdaptiveLayoutE } from '../elements/index'

import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export interface MiddleRowAdaptiveLayoutDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      top: any
      middle: any
      bottom: any
    }
  }
  _internals: {
    styles: {
      top: any
      middle: any
      bottom: any
    }
  }
}

/**
 * @param inputs.styles.top - Top element.
 * @param inputs.styles.middle - Middle element.
 * @param inputs.styles.bottom - Bottom element.
 */
export const makeMiddleRowAdaptiveLayoutDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, MiddleRowAdaptiveLayoutDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: () => {
    const topD = Data.empty<any>()
    const topRD = replayWithLatest(1, topD)
    const middleD = Data.empty<any>()
    const middleRD = replayWithLatest(1, middleD)
    const bottomD = Data.empty<any>()
    const bottomRD = replayWithLatest(1, bottomD)

    return {
      inputs: {
        styles: {
          top: topD,
          middle: middleD,
          bottom: bottomD
        }
      },
      _internals: {
        styles: {
          top: topRD,
          middle: middleRD,
          bottom: bottomRD
        }
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeMiddleRowAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeMiddleRowAdaptiveLayoutDC}
 */
export const useMiddleRowAdaptiveLayoutDC = useGUIDriver_(makeMiddleRowAdaptiveLayoutDC)
