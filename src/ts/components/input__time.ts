import {
  Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeTimeInputE } from '../elements/input__time'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { TemplateResult } from '../libs/lit-html'
import type { TimeInputElementType, TimeInputValue } from '../elements/input__time'

export interface TimeInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: TimeInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      value: string
      min: string
      max: string
      step: number | 'any'
    }
  }
  _internals: {
    styles: {
      type: TimeInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      value: string
      min: string
      max: string
      step: number | 'any'
    }
    actuations: {
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: TimeInputValue) => void
    }
  }
  outputs: {
    value: TimeInputValue
  }
}

export const makeTimeInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, TimeInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const typeD = Data.of<TimeInputElementType>('TimeInput')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const directionD = Data.of<'horizontal' | 'vertical'>('horizontal')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const informationD = Data.of('')
    const instructionsD = Data.of<any[]>([])
    const valueD = Data.of('00:00:00')
    const minD = Data.of('')
    const maxD = Data.of('')
    const stepD = Data.of<number | 'any'>('any')

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
    const minRD = replayWithLatest(1, minD)
    const maxRD = replayWithLatest(1, maxD)
    const stepRD = replayWithLatest(1, stepD)

    const [inputHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [changeHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()

    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<TimeInputValue>()
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
          value: valueD,
          min: minD,
          max: maxD,
          step: stepD
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
          value: valueRD,
          min: minRD,
          max: maxRD,
          step: stepRD
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
    return makeTimeInputE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeTimeInputDC}
 */
export const useTimeInputDC = useGUIDriver_(makeTimeInputDC)
