import {
  Data,
  replayWithLatest,
  makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeRadioInputE } from '../../elements/inputs/input__radio'

import type { ClassUnion } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { RadioInputElementType, RadioInputElementValue } from '../../elements/inputs/input__radio'

export interface RadioInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: RadioInputElementType
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      name: string
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      options: Array<{ label: string, checked?: boolean, value?: string }>
    }
  }
  _internals: {
    styles: {
      type: RadioInputElementType
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      name: string
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      options: Array<{ label: string, checked?: boolean, value?: string }>
    }
    actuations: {
      valueChangeHandler: (value: RadioInputElementValue) => void
    }
  }
  outputs: {
    value: RadioInputElementValue
  }
}

export const makeRadioInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, RadioInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const typeD = Data.of<RadioInputElementType>('RadioInput')
    const classesD = Data.of<ClassUnion>('')
    const directionD = Data.of<'horizontal' | 'vertical'>('horizontal')
    const nameD = Data.of('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const informationD = Data.of('')
    const instructionsD = Data.of<any[]>([])
    const optionsD = Data.of<Array<{ label: string, checked?: boolean, value?: string }>>([])

    const typeRD = replayWithLatest(1, typeD)
    const classesRD = replayWithLatest(1, classesD)
    const directionRD = replayWithLatest(1, directionD)
    const nameRD = replayWithLatest(1, nameD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const descriptionRD = replayWithLatest(1, descriptionD)
    const informationRD = replayWithLatest(1, informationD)
    const instructionsRD = replayWithLatest(1, instructionsD)
    const optionsRD = replayWithLatest(1, optionsD)

    const [valueChangeHandlerRD, , valueD] = makeGeneralCallback<RadioInputElementValue>()
    const valueRD = replayWithLatest(1, valueD)

    return {
      inputs: {
        styles: {
          type: typeD,
          classes: classesD,
          direction: directionD,
          name: nameD,
          label: labelD,
          title: titleD,
          description: descriptionD,
          information: informationD,
          instructions: instructionsD,
          options: optionsD
        }
      },
      _internals: {
        styles: {
          type: typeRD,
          classes: classesRD,
          direction: directionRD,
          name: nameRD,
          label: labelRD,
          title: titleRD,
          description: descriptionRD,
          information: informationRD,
          instructions: instructionsRD,
          options: optionsRD
        },
        actuations: {
          valueChangeHandler: valueChangeHandlerRD
        }
      },
      outputs: {
        value: valueRD
      }
    }
  },
  prepareTemplate: ({ styles, actuations }) => {
    return makeRadioInputE({ styles, actuations })
  }
})

/**
 * @see {@link makeRadioInputDC}
 */
export const useRadioInputDC = useGUIDriver_(makeRadioInputDC)
