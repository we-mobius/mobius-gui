import { makeUniqueString } from 'MobiusUtils'
import { createElementMaker } from '../../helpers/index'
import { makeFormItemLayoutE } from '../layout__form-item'
import { makeTagsInputorE } from '../inputors/tags-inputor'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { ElementOptions } from '../../helpers/index'
import type { TagsInputorRuntime, TagsInputorValue } from '../inputors/tags-inputor'
import type { TagInputorValue } from '../inputors/tag-inputor'

export type TagsInputElementType = 'TagsInput'
export interface TagsInputElementOptions extends ElementOptions {
  styles?: {
    /**
     * FormGroup member constraint.
     */
    type?: TagsInputElementType
    /**
     * FormGroup member constraint.
     */
    name?: string
    classes?: ClassUnion
    direction?: 'horizontal' | 'vertical'
    label?: string
    title?: string
    description?: string
    information?: string
    instructions?: any[]
    tags?: Array<string | {
      text: string
      placeholder?: string
      isEditable?: boolean
      isDeletable?: boolean
      isMoveable?: boolean
      isAlwaysShowDelete?: boolean
      isEditing?: boolean
    }>
    placeholder?: string
    isEditable?: boolean
    isDeletable?: boolean
    isMoveable?: boolean
    isAlwaysShowDelete?: boolean
    isEditing?: boolean

    minCount?: number
    maxCount?: number
  }
  actuations?: {
    runtimeHandler?: (runtime: TagsInputorRuntime) => void

    clickHandler?: (value: TagInputorValue) => void
    editHandler?: (value: TagInputorValue) => void
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>

    addHandler?: (value: TagInputorValue) => void
    deleteHandler?: (value: TagInputorValue) => void
    valueChangeHandler?: (value: TagsInputorValue) => void
  }
}
export type TagsInputValue = TagsInputorValue

export const makeTagsInputE = createElementMaker<TagsInputElementOptions>({
  marks: {},
  styles: {
    type: 'TagsInput',
    name: '',
    classes: '',
    direction: 'horizontal',
    label: '',
    title: '',
    description: '',
    information: '',
    instructions: [],
    tags: [],
    placeholder: '标签',
    isEditable: true,
    isDeletable: true,
    isMoveable: false,
    isAlwaysShowDelete: false,
    isEditing: false,
    minCount: 0,
    maxCount: Infinity
  },
  actuations: {
    runtimeHandler: runtime => { /** do nothing */ },

    clickHandler: value => { /** do nothing */ },
    editHandler: value => { /** do nothing */ },
    inputHandler: event => { /** do nothing */ },
    changeHandler: event => { /** do nothing */ },

    addHandler: value => { /** do nothing */ },
    deleteHandler: value => { /** do nothing */ },
    valueChangeHandler: value => { /** do nothing */ }
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations, utils: { html } }) => {
    const { classes, direction } = styles

    if (direction === 'horizontal') {
      const {
        name, label, title, description, information, instructions,
        tags, placeholder, isEditable, isDeletable, isMoveable, isAlwaysShowDelete, isEditing, minCount, maxCount
      } = styles
      const { inputHandler, changeHandler, valueChangeHandler } = actuations
      const labelPart = html`<div class="mobius-padding-x--r-base" title="${title}">${label}</div>`
      const descriptionPart = html`<div class="mobius-width--fullpct">${description}</div>`
      const informationPart = html`${information}`
      const instructionsPart = html`<div class="mobius-width--fullpct">${instructions.toString()}</div>`
      return makeFormItemLayoutE({
        styles: {
          classes: classes,
          direction: 'horizontal',
          label: labelPart,
          description: descriptionPart,
          input: makeTagsInputorE({
            styles: {
              classes: 'mobius-width--fullpct',
              name,
              title,
              tags,
              placeholder,
              isEditable,
              isDeletable,
              isMoveable,
              isAlwaysShowDelete,
              isEditing,
              minCount,
              maxCount
            },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    } else {
      const {
        name, label, title, description, information, instructions,
        tags, placeholder, isEditable, isDeletable, isMoveable, isAlwaysShowDelete, isEditing, minCount, maxCount
      } = styles
      const { inputHandler, changeHandler, valueChangeHandler } = actuations
      const labelPart = html`<div class="" title="${title}">${label}</div>`
      const descriptionPart = html`<div class="mobius-width--fullpct">${description}</div>`
      const informationPart = html`${information}`
      const instructionsPart = html`<div class="mobius-width--fullpct">${instructions.toString()}</div>`
      return makeFormItemLayoutE({
        styles: {
          classes: classes,
          direction: 'vertical',
          label: labelPart,
          description: descriptionPart,
          input: makeTagsInputorE({
            styles: {
              classes: 'mobius-width--fullpct',
              name,
              title,
              tags,
              placeholder,
              isEditable,
              isDeletable,
              isMoveable,
              isAlwaysShowDelete,
              isEditing,
              minCount,
              maxCount
            },
            actuations: { inputHandler, changeHandler, valueChangeHandler }
          }),
          information: informationPart,
          instructions: instructionsPart
        }
      })
    }
  }
})
