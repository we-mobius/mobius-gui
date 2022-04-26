import {
  Data,
  replayWithLatest,
  makeGeneralEventHandler, makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeCheckboxE } from '../../elements/inputors/checkbox'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { CheckboxElementType, CheckboxElementValue } from '../../elements/inputors/checkbox'

export interface CheckboxDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    marks: {
      id: string
    }
    styles: {
      type: CheckboxElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      checked: boolean
      indeterminate: boolean
      direction: 'ltr' | 'rtl'
      value: string
    }
  }
  _internals: {
    marks: {
      id: string
    }
    styles: {
      type: CheckboxElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      checked: boolean
      indeterminate: boolean
      direction: 'ltr' | 'rtl'
      value: string
    }
    actuations: {
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: CheckboxElementValue) => void
    }
  }
  outputs: {
    change: SynthesizeEvent<HTMLInputElement>
    value: CheckboxElementValue
  }
}

export const makeCheckboxDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, CheckboxDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idD = Data.of('')
    const typeD = Data.of<CheckboxElementType>('Checkbox')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const checkedD = Data.of(false)
    const indeterminateD = Data.of(false)
    const directionD = Data.of<'ltr' | 'rtl'>('ltr')
    const valueD = Data.of('on')

    const idRD = replayWithLatest(1, idD)
    const typeRD = replayWithLatest(1, typeD)
    const nameRD = replayWithLatest(1, nameD)
    const classesRD = replayWithLatest(1, classesD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const descriptionRD = replayWithLatest(1, descriptionD)
    const checkedRD = replayWithLatest(1, checkedD)
    const indeterminateRD = replayWithLatest(1, indeterminateD)
    const directionRD = replayWithLatest(1, directionD)
    const valueRD = replayWithLatest(1, valueD)

    const [changeHandlerRD, ,changeD] = makeGeneralEventHandler<HTMLInputElement>()
    const changeRD = replayWithLatest(1, changeD)
    const [valueChangeHandlerRD, ,valueChangeD] = makeGeneralCallback<CheckboxElementValue>()
    const checkboxValueRD = replayWithLatest(1, valueChangeD)

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
          checked: checkedD,
          indeterminate: indeterminateD,
          direction: directionD,
          value: valueD
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
          checked: checkedRD,
          indeterminate: indeterminateRD,
          direction: directionRD,
          value: valueRD
        },
        actuations: {
          changeHandler: changeHandlerRD,
          valueChangeHandler: valueChangeHandlerRD
        }
      },
      outputs: {
        change: changeRD,
        value: checkboxValueRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations }, template, mutation, contexts) => {
    return makeCheckboxE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeCheckboxDC}
 */
export const useCheckboxDC = useGUIDriver_(makeCheckboxDC)
