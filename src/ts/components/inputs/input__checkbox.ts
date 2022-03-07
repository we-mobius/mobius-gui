import {
  Data,
  replayWithLatest,
  makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeCheckboxInputE } from '../../elements/inputs/input__checkbox'

import type { ClassUnion } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { CheckboxInputElementType, CheckboxInputElementValue } from '../../elements/inputs/input__checkbox'

export interface CheckboxInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: CheckboxInputElementType
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      name: string
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      options: Array<{ label: string, checked?: boolean, indeterminate?: boolean, value?: string }>
    }
  }
  _internals: {
    styles: {
      type: CheckboxInputElementType
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      name: string
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
      options: Array<{ label: string, checked?: boolean, indeterminate?: boolean, value?: string }>
    }
    actuations: {
      valueChangeHandler: (value: CheckboxInputElementValue) => void
    }
  }
  outputs: {
    value: CheckboxInputElementValue
  }
}

export const makeCheckboxInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, CheckboxInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const typeD = Data.of<CheckboxInputElementType>('CheckboxInput')
    const classesD = Data.of<ClassUnion>('')
    const directionD = Data.of<'horizontal' | 'vertical'>('horizontal')
    const nameD = Data.of('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const informationD = Data.of('')
    const instructionsD = Data.of<any[]>([])
    const optionsD = Data.of<Array<{ label: string, checked?: boolean, indeterminate?: boolean, value?: string }>>([])

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

    const [valueChangeHandlerRD, , valueD] = makeGeneralCallback<CheckboxInputElementValue>()
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
    return makeCheckboxInputE({ styles, actuations })
  }
})

/**
 * @see {@link makeCheckboxInputDC}
 */
export const useCheckboxInputDC = useGUIDriver_(makeCheckboxInputDC)
