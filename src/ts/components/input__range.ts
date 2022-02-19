import {
  Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeRangeInputE } from '../elements/input__range'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { TemplateResult } from '../libs/lit-html'
import type { RangeInputElementType, RangeInputValue } from '../elements/input__range'

export interface RangeInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: RangeInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      value: number
      min: number
      max: number
      step: number | 'any'
    }
  }
  _internals: {
    styles: {
      type: RangeInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      value: number
      min: number
      max: number
      step: number | 'any'
    }
    actuations: {
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: RangeInputValue) => void
    }
  }
  outputs: {
    value: RangeInputValue
  }
}

export const makeRangeInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, RangeInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const typeD = Data.of<RangeInputElementType>('RangeInput')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const directionD = Data.of<'horizontal' | 'vertical'>('horizontal')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const informationD = Data.of('')
    const instructionsD = Data.of<any[]>([])
    const valueD = Data.of(0)
    const minD = Data.of(-Infinity)
    const maxD = Data.of(Infinity)
    const stepD = Data.of<number | 'any'>(1)

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

    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<RangeInputValue>()
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
    return makeRangeInputE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeRangeInputDC}
 */
export const useRangeInputDC = useGUIDriver_(makeRangeInputDC)
