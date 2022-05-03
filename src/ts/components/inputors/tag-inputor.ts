import { Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback } from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeTagInputorE, TagInputorRuntime } from '../../elements/inputors/tag-inputor'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { TagInputorElementType, TagInputorValue } from '../../elements/inputors/tag-inputor'

export interface TagInputorDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    marks: {
      id: string
    }
    styles: {
      type: TagInputorElementType
      classes: ClassUnion
      name: string
      label: string
      title: string
      text: string
      placeholder: string
      isEditable: boolean
      isDeletable: boolean
      isMoveable: boolean
      isAlwaysShowDelete: boolean
      isEditing: boolean
    }
  }
  _internals: {
    marks: {
      id: string
    }
    styles: {
      type: TagInputorElementType
      classes: ClassUnion
      name: string
      label: string
      title: string
      text: string
      placeholder: string
      isEditable: boolean
      isDeletable: boolean
      isMoveable: boolean
      isAlwaysShowDelete: boolean
      isEditing: boolean
    }
    actuations: {
      runtimeHandler: (runtime: TagInputorRuntime) => void
      clickHandler: (value: TagInputorValue) => void
      keydownHandler?: (event: SynthesizeEvent<HTMLInputElement> & KeyboardEvent) => void
      editHandler: (value: TagInputorValue) => void
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>
      exitHandler: (value: TagInputorValue) => void
      deleteHandler: (value: TagInputorValue) => void
      valueChangeHandler: (value: TagInputorValue) => void
    }
  }
  outputs: {
    value: TagInputorValue
  }
}

export const makeTagInputorDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, TagInputorDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idD = Data.of('')
    const typeD = Data.of<TagInputorElementType>('TagInputor')
    const classesD = Data.of<ClassUnion>('')
    const nameD = Data.of('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const textD = Data.of('')
    const placeholderD = Data.of('')
    const isEditableD = Data.of(true)
    const isDeletableD = Data.of(true)
    const isMoveableD = Data.of(false)
    const isAlwaysShowDeleteD = Data.of(false)
    const isEditingD = Data.of(false)

    const idRD = replayWithLatest(1, idD)
    const typeRD = replayWithLatest(1, typeD)
    const classesRD = replayWithLatest(1, classesD)
    const nameRD = replayWithLatest(1, nameD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const textRD = replayWithLatest(1, textD)
    const placeholderRD = replayWithLatest(1, placeholderD)
    const isEditableRD = replayWithLatest(1, isEditableD)
    const isDeletableRD = replayWithLatest(1, isDeletableD)
    const isMoveableRD = replayWithLatest(1, isMoveableD)
    const isAlwaysShowDeleteRD = replayWithLatest(1, isAlwaysShowDeleteD)
    const isEditingRD = replayWithLatest(1, isEditingD)

    const [runtimeHandlerRD, , runtimeD] = makeGeneralCallback<TagInputorRuntime>()
    const [clickHandlerRD, , clickD] = makeGeneralCallback<TagInputorValue>()
    const [keydownHandlerRD, , keydownD] = makeGeneralCallback<SynthesizeEvent<HTMLInputElement> & KeyboardEvent>()
    const [editHandlerRD, , editD] = makeGeneralCallback<TagInputorValue>()
    const [inputHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [changeHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [exitHandlerRD, , exitD] = makeGeneralCallback<TagInputorValue>()
    const [deleteHandlerRD, , deleteD] = makeGeneralCallback<TagInputorValue>()
    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<TagInputorValue>()
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
          text: textD,
          placeholder: placeholderD,
          isEditable: isEditableD,
          isDeletable: isDeletableD,
          isMoveable: isMoveableD,
          isAlwaysShowDelete: isAlwaysShowDeleteD,
          isEditing: isEditingD
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
          text: textRD,
          placeholder: placeholderRD,
          isEditable: isEditableRD,
          isDeletable: isDeletableRD,
          isMoveable: isMoveableRD,
          isAlwaysShowDelete: isAlwaysShowDeleteRD,
          isEditing: isEditingRD
        },
        actuations: {
          runtimeHandler: runtimeHandlerRD,
          clickHandler: clickHandlerRD,
          editHandler: editHandlerRD,
          keydownHandler: keydownHandlerRD,
          inputHandler: inputHandlerRD,
          changeHandler: changeHandlerRD,
          exitHandler: exitHandlerRD,
          deleteHandler: deleteHandlerRD,
          valueChangeHandler: valueChangeHandlerRD
        }
      },
      outputs: {
        value: inputValueRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations }) => {
    return makeTagInputorE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeTagInputorDC}
 */
export const useTagInputorDC = useGUIDriver_(makeTagInputorDC)
