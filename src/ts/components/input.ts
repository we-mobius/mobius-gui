import { Data, replayWithLatest, makeGeneralEventHandler } from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeInputE } from '../elements/input'

import type { EventHandler } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { InputElementType } from '../elements/input'

export interface InputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: InputElementType
      inputType: string
    }
  }
  _internals: {
    styles: {
      type: InputElementType
      inputType: string
    }
    actuations: {
      changeHandler: EventHandler<HTMLInputElement>
    }
  }
}

/**
 *
 */
export const makeInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, InputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: () => {
    const typeD = Data.of<InputElementType>('Input')
    const typeRD = replayWithLatest(1, typeD)

    const inputTypeD = Data.empty<string>()
    const inputTypeRD = replayWithLatest(1, inputTypeD)

    const [changeHandlerRD, , changeD] = makeGeneralEventHandler<HTMLInputElement>()
    const changeRD = replayWithLatest(1, changeD)

    return {
      inputs: {
        styles: {
          type: typeD,
          inputType: inputTypeD
        }
      },
      _internals: {
        styles: {
          type: typeRD,
          inputType: inputTypeRD
        },
        actuations: {
          changeHandler: changeHandlerRD
        }
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeInputE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeInputDC}
 */
export const useInputDC = useGUIDriver_(makeInputDC)
