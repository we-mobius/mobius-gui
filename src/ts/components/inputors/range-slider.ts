import { Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback } from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeRangeSliderE } from '../../elements/inputors/range-slider'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { RangeSliderElementType, RangeSliderValue } from '../../elements/inputors/range-slider'

export interface RangeSliderDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    marks: {
      id: string
    }
    styles: {
      type: RangeSliderElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      direction: 'ltr' | 'rtl'
      value: number
      min: number
      max: number
      step: number | 'any'
    }
  }
  _internals: {
    marks: {
      id: string
    }
    styles: {
      type: RangeSliderElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      direction: 'ltr' | 'rtl'
      value: number
      min: number
      max: number
      step: number | 'any'
    }
    actuations: {
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: RangeSliderValue) => void
    }
  }
  outputs: {
    value: RangeSliderValue
  }
}

export const makeRangeSliderDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, RangeSliderDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idD = Data.of('')
    const typeD = Data.of<RangeSliderElementType>('RangeSlider')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const directionD = Data.of<'ltr' | 'rtl'>('ltr')
    const valueD = Data.of(0)
    const minD = Data.of(-Infinity)
    const maxD = Data.of(Infinity)
    const stepD = Data.of<number | 'any'>(1)

    const idRD = replayWithLatest(1, idD)
    const typeRD = replayWithLatest(1, typeD)
    const nameRD = replayWithLatest(1, nameD)
    const classesRD = replayWithLatest(1, classesD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const descriptionRD = replayWithLatest(1, descriptionD)
    const directionRD = replayWithLatest(1, directionD)
    const valueRD = replayWithLatest(1, valueD)
    const minRD = replayWithLatest(1, minD)
    const maxRD = replayWithLatest(1, maxD)
    const stepRD = replayWithLatest(1, stepD)

    const [inputHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [changeHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<RangeSliderValue>()
    const inputValueRD = replayWithLatest(1, inputValueD)

    return {
      inputs: {
        marks: {
          id: idD
        },
        styles: {
          type: typeD,
          name: nameD,
          classes: classesD,
          label: labelD,
          title: titleD,
          description: descriptionD,
          direction: directionD,
          value: valueD,
          min: minD,
          max: maxD,
          step: stepD
        }
      },
      _internals: {
        marks: {
          id: idRD
        },
        styles: {
          type: typeRD,
          name: nameRD,
          classes: classesRD,
          label: labelRD,
          title: titleRD,
          description: descriptionRD,
          direction: directionRD,
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
    return makeRangeSliderE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeRangeSliderDC}
 */
export const useRangeSliderDC = useGUIDriver_(makeRangeSliderDC)
