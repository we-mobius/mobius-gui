import { Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback } from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeTagsInputorE, TagsInputorRuntime } from '../../elements/inputors/tags-inputor'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { TagInputorValue } from '../../elements/inputors/tag-inputor'
import type { TagsInputorElementType, TagsInputorValue } from '../../elements/inputors/tags-inputor'

export interface TagsInputorDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    marks: {
      id: string
    }
    styles: {
      type: TagsInputorElementType
      classes: ClassUnion
      name: string
      label: string
      title: string
      tags: Array<string | {
        text: string
        placeholder?: string
        isEditable?: boolean
        isDeletable?: boolean
        isMoveable?: boolean
        isAlwaysShowDelete?: boolean
        isEditing?: boolean
      }>
      placeholder: string
      isEditable: boolean
      isDeletable: boolean
      isMoveable: boolean
      isAlwaysShowDelete: boolean
      isEditing: boolean
      minCount: number
      maxCount: number
    }
  }
  _internals: {
    marks: {
      id: string
    }
    styles: {
      type: TagsInputorElementType
      classes: ClassUnion
      name: string
      label: string
      title: string
      tags: Array<string | {
        text: string
        placeholder?: string
        isEditable?: boolean
        isDeletable?: boolean
        isMoveable?: boolean
        isAlwaysShowDelete?: boolean
        isEditing?: boolean
      }>
      placeholder: string
      isEditable: boolean
      isDeletable: boolean
      isMoveable: boolean
      isAlwaysShowDelete: boolean
      isEditing: boolean
      minCount: number
      maxCount: number
    }
    actuations: {
      runtimeHandler: (runtime: TagsInputorRuntime) => void

      clickHandler: (value: TagInputorValue) => void
      editHandler: (value: TagInputorValue) => void
      inputHandler: EventHandler<HTMLInputElement>
      changeHandler: EventHandler<HTMLInputElement>

      addHandler: (value: TagInputorValue) => void
      deleteHandler: (value: TagInputorValue) => void
      valueChangeHandler: (value: TagsInputorValue) => void
    }
  }
  outputs: {
    value: TagsInputorValue
  }
}

export const makeTagsInputorDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, TagsInputorDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idD = Data.of('')
    const typeD = Data.of<TagsInputorElementType>('TagsInputor')
    const classesD = Data.of<ClassUnion>('')
    const nameD = Data.of('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const tagsD = Data.of<Array<string | {
      text: string
      placeholder?: string
      isEditable?: boolean
      isDeletable?: boolean
      isMoveable?: boolean
      isAlwaysShowDelete?: boolean
      isEditing?: boolean
    }>>([])
    const placeholderD = Data.of('')
    const isEditableD = Data.of(true)
    const isDeletableD = Data.of(true)
    const isMoveableD = Data.of(false)
    const isAlwaysShowDeleteD = Data.of(false)
    const isEditingD = Data.of(false)
    const minCountD = Data.of(0)
    const maxCountD = Data.of(Infinity)

    const idRD = replayWithLatest(1, idD)
    const typeRD = replayWithLatest(1, typeD)
    const classesRD = replayWithLatest(1, classesD)
    const nameRD = replayWithLatest(1, nameD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const tagsRD = replayWithLatest(1, tagsD)
    const placeholderRD = replayWithLatest(1, placeholderD)
    const isEditableRD = replayWithLatest(1, isEditableD)
    const isDeletableRD = replayWithLatest(1, isDeletableD)
    const isMoveableRD = replayWithLatest(1, isMoveableD)
    const isAlwaysShowDeleteRD = replayWithLatest(1, isAlwaysShowDeleteD)
    const isEditingRD = replayWithLatest(1, isEditingD)
    const minCountRD = replayWithLatest(1, minCountD)
    const maxCountRD = replayWithLatest(1, maxCountD)

    const [runtimeHandlerRD, , runtimeD] = makeGeneralCallback<TagsInputorRuntime>()
    const [clickHandlerRD, , clickD] = makeGeneralCallback<TagInputorValue>()
    const [editHandlerRD, , editD] = makeGeneralCallback<TagInputorValue>()
    const [inputHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [changeHandlerRD] = makeGeneralEventHandler<HTMLInputElement>()
    const [addHandlerRD, , addD] = makeGeneralCallback<TagInputorValue>()
    const [deleteHandlerRD, , deleteD] = makeGeneralCallback<TagInputorValue>()
    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<TagsInputorValue>()
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
          tags: tagsD,
          placeholder: placeholderD,
          isEditable: isEditableD,
          isDeletable: isDeletableD,
          isMoveable: isMoveableD,
          isAlwaysShowDelete: isAlwaysShowDeleteD,
          isEditing: isEditingD,
          minCount: minCountD,
          maxCount: maxCountD
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
          tags: tagsRD,
          placeholder: placeholderRD,
          isEditable: isEditableRD,
          isDeletable: isDeletableRD,
          isMoveable: isMoveableRD,
          isAlwaysShowDelete: isAlwaysShowDeleteRD,
          isEditing: isEditingRD,
          minCount: minCountRD,
          maxCount: maxCountRD
        },
        actuations: {
          runtimeHandler: runtimeHandlerRD,
          clickHandler: clickHandlerRD,
          editHandler: editHandlerRD,
          inputHandler: inputHandlerRD,
          changeHandler: changeHandlerRD,
          addHandler: addHandlerRD,
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
    return makeTagsInputorE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeTagsInputorDC}
 */
export const useTagsInputorDC = useGUIDriver_(makeTagsInputorDC)
