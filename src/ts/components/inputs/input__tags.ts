import {
  Data, replayWithLatest, makeGeneralEventHandler, makeGeneralCallback
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeTagsInputE } from '../../elements/inputs/input__tags'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { TemplateResult } from '../../libs/lit-html'
import type { TagInputorValue } from '../../elements/inputors/tag-inputor'
import type { TagsInputorRuntime } from '../../elements/inputors/tags-inputor'
import type { TagsInputElementType, TagsInputValue } from '../../elements/inputs/input__tags'

export interface TagsInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      type: TagsInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
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
    styles: {
      type: TagsInputElementType
      name: string
      classes: ClassUnion
      direction: 'horizontal' | 'vertical'
      label: string
      title: string
      description: string
      information: string
      instructions: any[]
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
      valueChangeHandler: (value: TagsInputValue) => void
    }
  }
  outputs: {
    value: TagsInputValue
  }
}

export const makeTagsInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, TagsInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const typeD = Data.of<TagsInputElementType>('TagsInput')
    const nameD = Data.of('')
    const classesD = Data.of<ClassUnion>('')
    const directionD = Data.of<'horizontal' | 'vertical'>('horizontal')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const descriptionD = Data.of('')
    const informationD = Data.of('')
    const instructionsD = Data.of<any[]>([])
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

    const typeRD = replayWithLatest(1, typeD)
    const nameRD = replayWithLatest(1, nameD)
    const classesRD = replayWithLatest(1, classesD)
    const directionRD = replayWithLatest(1, directionD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const descriptionRD = replayWithLatest(1, descriptionD)
    const informationRD = replayWithLatest(1, informationD)
    const instructionsRD = replayWithLatest(1, instructionsD)
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
    const [valueChangeHandlerRD, , inputValueD] = makeGeneralCallback<TagsInputValue>()
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
    return makeTagsInputE({ marks, styles, actuations })
  }
})

/**
 * @see {@link makeTagsInputDC}
 */
export const useTagsInputDC = useGUIDriver_(makeTagsInputDC)
