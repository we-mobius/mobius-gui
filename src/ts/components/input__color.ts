import {
  Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeColorInputE } from '../elements/input__color'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { TemplateResult } from '../libs/lit-html'
import type { ColorInputElementType, ColorInputValue } from '../elements/input__color'

export interface ColorInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: ColorInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      value: string
    }
  }
  _internals: {
    styles: {
      type: ColorInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      value: string
    }
    actuations: {
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: ColorInputValue) => void
    }
  }
  outputs: {
    value: ColorInputValue
  }
}

export const makeColorInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, ColorInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const typeD = Data.of<ColorInputElementType>('ColorInput')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const directionD = Data.of<'horizontal' | 'vertical'>('horizontal')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const informationD = Data.of('')
    const instructionsD = Data.of<any[]>([])
    const valueD = Data.of('')

    const typeRD = replayWithLatest(1, typeD)
    const nameRD = replayWithLatest(1, nameD)
    const classesRD = replayWithLatest(1, classesD)
    const directionRD = replayWithLatest(1, directionD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const descriptionRD = replayWithLatest(1, descriptionD)
    const informationRD = replayWithLatest(1, informationD)
    const instructionsRD = replayWithLatest(1, instructionsD)
    const valueRD = replayWithLatest(1, valueD)

    const [inputHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [changeHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()

    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<ColorInputValue>()
    const inputValueRD = replayWithLatest(1, inputValueD)

    return {
      inputs: {
        styles: {
          type: typeD,
          name: nameD,
          classes: classesD,
          direction: directionD,
          label: labelD,
          title: titleD,
          description: descriptionD,
          information: informationD,
          instructions: instructionsD,
          value: valueD
        }
      },
      _internals: {
        styles: {
          type: typeRD,
          name: nameRD,
          classes: classesRD,
          direction: directionRD,
          label: labelRD,
          title: titleRD,
          description: descriptionRD,
          information: informationRD,
          instructions: instructionsRD,
          value: valueRD
        },
        actuations: {
          inputHandler: inputHandlerRD,
          changeHandler: changeHandlerRD,
          valueChangeHandler: valueChangeHandlerRD
        }
      },
      outputs: {
        value: inputValueRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations }) => {
    return makeColorInputE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeColorInputDC}
 */
export const useColorInputDC = useGUIDriver_(makeColorInputDC)
