import { Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback } from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeLongTextInputorE } from '../../elements/inputors/longtext-inputor'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { LongTextInputorElementType, LongTextInputorValue } from '../../elements/inputors/longtext-inputor'

export interface LongTextInputorDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    marks: {
      id: string
    }
    styles: {
      type: LongTextInputorElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      direction: 'ltr' | 'rtl'
      value: string
      rows: number
      minlength: number
      maxlength: number
      placeholder: string
    }
  }
  _internals: {
    marks: {
      id: string
    }
    styles: {
      type: LongTextInputorElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      direction: 'ltr' | 'rtl'
      value: string
      rows: number
      minlength: number
      maxlength: number
      placeholder: string
    }
    actuations: {
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: LongTextInputorValue) => void
    }
  }
  outputs: {
    value: LongTextInputorValue
  }
}

export const makeLongTextInputorDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, LongTextInputorDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idD = Data.of('')
    const typeD = Data.of<LongTextInputorElementType>('LongTextInputor')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const directionD = Data.of<'ltr' | 'rtl'>('ltr')
    const valueD = Data.of('')
    const rowsD = Data.of(3)
    const minlengthD = Data.of(0)
    const maxlengthD = Data.of(999)
    const placeholderD = Data.of('')

    const idRD = replayWithLatest(1, idD)
    const typeRD = replayWithLatest(1, typeD)
    const nameRD = replayWithLatest(1, nameD)
    const classesRD = replayWithLatest(1, classesD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const descriptionRD = replayWithLatest(1, descriptionD)
    const directionRD = replayWithLatest(1, directionD)
    const valueRD = replayWithLatest(1, valueD)
    const rowsRD = replayWithLatest(1, rowsD)
    const minlengthRD = replayWithLatest(1, minlengthD)
    const maxlengthRD = replayWithLatest(1, maxlengthD)
    const placeholderRD = replayWithLatest(1, placeholderD)

    const [inputHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [changeHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<LongTextInputorValue>()
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
          rows: rowsD,
          minlength: minlengthD,
          maxlength: maxlengthD,
          placeholder: placeholderD
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
          rows: rowsRD,
          minlength: minlengthRD,
          maxlength: maxlengthRD,
          placeholder: placeholderRD
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
    return makeLongTextInputorE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeLongTextInputorDC}
 */
export const useLongTextInputorDC = useGUIDriver_(makeLongTextInputorDC)
