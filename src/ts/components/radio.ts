import {
  Data,
  replayWithLatest,
  makeGeneralEventHandler, makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeRadioE } from '../elements/radio'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { RadioElementType, RadioElementValue } from '../elements/radio'

export interface RadioDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    marks: {
      id: string
    }
    styles: {
      type: RadioElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      checked: boolean
      direction: 'ltr' | 'rtl'
      value: string
    }
  }
  _internals: {
    marks: {
      id: string
    }
    styles: {
      type: RadioElementType
      name: string
      classes: ClassUnion
      label: string
      title: string
      description: string
      checked: boolean
      direction: 'ltr' | 'rtl'
      value: string
    }
    actuations: {
      changeHandler: EventHandler<HTMLInputElement>
      valueChangeHandler: (value: RadioElementValue) => void
    }
  }
  outputs: {
    change: SynthesizeEvent<HTMLInputElement>
    value: RadioElementValue
  }
}

export const makeRadioDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, RadioDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idD = Data.of('')
    const typeD = Data.of<RadioElementType>('Radio')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const checkedD = Data.of(false)
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
    const directionRD = replayWithLatest(1, directionD)
    const valueRD = replayWithLatest(1, valueD)

    const [changeHandlerRD, ,changeD] = makeGeneralEventHandler<HTMLInputElement>()
    const changeRD = replayWithLatest(1, changeD)
    const [valueChangeHandlerRD, ,valueChangeD] = makeGeneralCallback<RadioElementValue>()
    const radioValueRD = replayWithLatest(1, valueChangeD)

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
        value: radioValueRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations }, template, mutation, contexts) => {
    return makeRadioE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeRadioDC}
 */
export const useRadioDC = useGUIDriver_(makeRadioDC)
