import { toClassString, makeUniqueString, debounceS, isString } from 'MobiusUtils'
import { createElementMaker, ElementBaseRuntime } from '../../helpers/index'
import { makeTagInputorE } from './tag-inputor'
import { render } from '../../libs/lit-html'

import type { NonUndefinedable, ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions, ElementRuntimeOptions } from '../../helpers/index'
import type { TagInputorElementOptions, TagInputorRuntime, TagInputorValue } from './tag-inputor'

export type TagsInputorElementType = 'TagsInputor'
export interface TagsInputorElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    /**
     * Type name of TagsInputor element. Constraint for the role form-group member.
     */
    type?: TagsInputorElementType
    /**
     * `classes` that will be added to root element of TagsInputor element structure.
     */
    classes?: ClassUnion
    /**
     * Name of TagsInputor.
     */
    name?: string
    /**
     * Label of TagsInputor, currently unused.
     */
    label?: string
    title?: string
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
export interface TagsInputorValue {
  name: string
  label: string
  tags: TagInputorValue[]
  value: TagInputorValue[]
  valueAsString: string
  minCount: number
  maxCount: number
}

type TagsInputorRuntimeOptions = ElementRuntimeOptions<TagsInputorElementOptions>
/**
 * Non undefined 的创建 TagElement 的 styles 参数。
 */
type ValidTagInputorElementStyles = NonUndefinedable<TagInputorElementOptions['styles']>
/**
 * Tags runtime 用于管理 Tag 的一组值或对象。
 */
interface TagRelated {
  styles: ValidTagInputorElementStyles
  ref: HTMLDivElement | undefined
  runtime: TagInputorRuntime | undefined
  isDeleted: boolean
}
export class TagsInputorRuntime extends ElementBaseRuntime<TagsInputorElementOptions> {
  rootRef: HTMLDivElement | undefined
  addRef: HTMLDivElement | undefined
  /**
   * Q: Why use `Array` instead of `Map`? A: Because `Map` is not ordered, but `index` is useful here.
   */
  tags: TagRelated[]
  debouncedValueChangeHandler: (value: TagsInputorValue) => void

  constructor (options: TagsInputorRuntimeOptions) {
    super(options)
    this.tags = []
    // 初始化最初的标签组
    this.styles.tags.forEach((tagStyles) => {
      const intactTagStyles = this.getIntactTagStyles(tagStyles)
      this.registerTagByStyles(intactTagStyles)
    })
    // 准备一些辅助变量
    this.debouncedValueChangeHandler = debounceS(this.actuations.valueChangeHandler, 500)
  }

  get value (): TagsInputorValue {
    const tagsValue = this.tags
      .filter(tag => !tag.isDeleted && tag.runtime !== undefined)
      .map(tag => tag.runtime!.value)
    return {
      name: this.styles.name,
      label: this.styles.label,
      tags: tagsValue,
      value: tagsValue,
      valueAsString: JSON.stringify(tagsValue),
      minCount: this.styles.minCount,
      maxCount: this.styles.maxCount
    }
  }

  setRootRef (ref: HTMLDivElement | undefined): void {
    this.rootRef = ref
  }

  setAddRef (ref: HTMLDivElement | undefined): void {
    this.addRef = ref
  }

  /**
   * 生成完整的 tag styles，可以直接用于 makeTagInputorE 生成 tag element
   */
  getIntactTagStyles (
    tagStyles: NonUndefinedable<TagsInputorRuntimeOptions['styles']['tags']>[number]
  ): ValidTagInputorElementStyles {
    const { name, label, placeholder, isEditable, isDeletable, isMoveable, isAlwaysShowDelete } = this.styles
    const intactTagStyles = isString(tagStyles)
      ? { text: tagStyles, name, label, placeholder, isEditable, isDeletable, isMoveable, isAlwaysShowDelete }
      : { name, label, placeholder, isEditable, isDeletable, isMoveable, isAlwaysShowDelete, ...tagStyles }
    return intactTagStyles
  }

  getTagByStyles (styles: ValidTagInputorElementStyles): TagRelated | undefined {
    return this.tags.find(tag => tag.styles === styles)
  }

  setTagRuntimeByStyles (styles: ValidTagInputorElementStyles, runtime: TagInputorRuntime): void {
    const tag = this.getTagByStyles(styles)
    if (tag !== undefined) {
      tag.runtime = runtime
    }
  }

  setTagRefByStyles (styles: ValidTagInputorElementStyles, ref: HTMLDivElement | undefined): void {
    const tag = this.getTagByStyles(styles)
    if (tag !== undefined) {
      tag.ref = ref
    }
  }

  triggerAddEventByStyles (styles: ValidTagInputorElementStyles): void {
    const tag = this.getTagByStyles(styles)
    if (tag?.runtime !== undefined) {
      this.actuations.addHandler(tag.runtime.value)
    }
  }

  triggerDeleteEventByStyles (styles: ValidTagInputorElementStyles): void {
    const tag = this.getTagByStyles(styles)
    if (tag?.runtime !== undefined) {
      this.actuations.deleteHandler(tag.runtime.value)
    }
  }

  triggerValueChangeEvent (): void {
    this.debouncedValueChangeHandler(this.value)
  }

  registerTagByStyles (styles: ValidTagInputorElementStyles): void {
    this.tags.push({ styles: styles, ref: undefined, runtime: undefined, isDeleted: false })
    const tagRef = this.buildTagRef(styles)
    this.setTagRefByStyles(styles, tagRef)
  }

  insertTagByStyles (styles: ValidTagInputorElementStyles): void {
    const tag = this.getTagByStyles(styles)
    const tagRef = tag?.ref
    if (this.rootRef !== undefined && this.addRef !== undefined && tagRef !== undefined) {
      this.rootRef.insertBefore(tagRef, this.addRef)
    }
  }

  deleteTagByStyles (styles: ValidTagInputorElementStyles): void {
    const tag = this.getTagByStyles(styles)
    if (tag !== undefined && this.rootRef !== undefined && tag.ref !== undefined && !tag.isDeleted) {
      this.rootRef.removeChild(tag.ref)
      tag.isDeleted = true
      this.triggerDeleteEventByStyles(styles)
    }
  }

  buildTagRef (intactTagStyles: ValidTagInputorElementStyles): HTMLDivElement {
    const fragment = document.createDocumentFragment()
    render(makeTagInputorE({
      styles: intactTagStyles,
      actuations: {
        runtimeHandler: runtime => {
          this.setTagRuntimeByStyles(intactTagStyles, runtime)
        },

        clickHandler: value => {
          this.actuations.clickHandler(value)
        },
        keydownHandler: event => {
          const { code } = event
          if (code === 'Space') {
            const tag = this.getTagByStyles(intactTagStyles)
            // TODO: 改进新标签的插入位置
            if (tag?.runtime !== undefined) {
              const tagText = tag.runtime.styles.text
              if (tagText.endsWith(',') || tagText.endsWith('，') || tagText.endsWith(' ')) {
                tag.runtime.setText(tagText.slice(0, -1))
                tag.runtime.exitEditingMode({ force: true })
                this.addNewTag()
                // 结束该事件的处理，防止空格输入到新创建的标签中
                event.preventDefault()
              }
            }
          }
        },
        editHandler: value => {
          this.actuations.editHandler(value)
          this.enterEditingMode()
        },
        inputHandler: event => {
          this.actuations.inputHandler(event)
          this.triggerValueChangeEvent()
        },
        changeHandler: event => {
          this.actuations.changeHandler(event)
          this.triggerValueChangeEvent()
          this.exitEditingMode()
        },
        exitHandler: value => {
          this.exitEditingMode()
        },

        deleteHandler: value => {
          this.deleteTagByStyles(intactTagStyles)
          this.triggerValueChangeEvent()
        },
        valueChangeHandler: value => {
          this.triggerValueChangeEvent()
        }
      }
    }), fragment)
    const insertedTag = fragment.children[0] as HTMLDivElement
    return insertedTag
  }

  addTagByStyles (styles: ValidTagInputorElementStyles): void {
    this.registerTagByStyles(styles)
    this.insertTagByStyles(styles)
    this.triggerAddEventByStyles(styles)
  }

  editTagByStyles (styles: ValidTagInputorElementStyles): void {
    const tag = this.getTagByStyles(styles)
    if (tag !== undefined && !tag.isDeleted && tag.runtime !== undefined) {
      tag.runtime.enterEditingMode({ force: true })
      tag.runtime.selectAll()
      this.enterEditingMode({ force: true })
    }
  }

  addNewTag (): void {
    const intactTagStyles = this.getIntactTagStyles({ text: '标签' })
    this.addTagByStyles(intactTagStyles)
    this.editTagByStyles(intactTagStyles)
  }

  enterEditingMode ({ force }: {force: boolean} = { force: false }): void {
    if (this.styles.isEditing && !force) return
    if (this.rootRef !== undefined) {
      this.styles.isEditing = true
      this.rootRef.setAttribute('is-editing', 'true')
    }
  }

  exitEditingMode ({ force }: { force: boolean } = { force: false }): void {
    if (!this.styles.isEditing && !force) return
    if (this.rootRef !== undefined) {
      this.styles.isEditing = false
      this.rootRef.removeAttribute('is-editing')
    }
  }
}

/**
 * @todo TODO: 新建标签默认全选文字
 * @todo TODO: 输入时根据指定分隔符自动切分标签
 * @todo TODO: 正在编辑时按 tab 键自动切换到下一个标签，如果当前标签为最后一个，则新建一个标签
 * @todo TODO: 按 tab 键在标签之间切换，切换之后按 Enter 进行编辑， Shift + Tab 向前切换，Tab 向后切换
 * @todo TODO: minCount & maxCount
 */
export const makeTagsInputorE = createElementMaker<TagsInputorElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'TagsInputor',
    classes: '',
    name: '',
    label: '',
    title: '',
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
  prepareTemplate: (view, { marks, styles, actuations, configs, utils: { html, ref } }) => {
    const { id } = marks
    const {
      classes, name, label, title,
      isEditable, isDeletable, isMoveable, isAlwaysShowDelete, isEditing,
      minCount, maxCount
    } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-tags-inputor')

    const runtime = new TagsInputorRuntime({ marks, styles, actuations, configs })

    const {
      runtimeHandler
    } = actuations
    runtimeHandler(runtime)
    const addHandlerDelegator = (event: SynthesizeEvent<HTMLDivElement>): void => {
      runtime.addNewTag()
    }
    const dblclickHandlerDelegator = (event: SynthesizeEvent<HTMLDivElement>): void => {
      if (event.target === runtime.rootRef) {
        runtime.addNewTag()
      }
    }

    const addPart = html`
      <div
        class="mobius-tags__add"
        title="点击添加一个新标签"
        @click="${addHandlerDelegator}"
        ${ref(element => { runtime.setAddRef(element as HTMLDivElement) })}
      >+</div>
    `

    return view`
      <div
        id="${elementId}" class="mobius-tags ${toClassString(classes)}"
        data-name="${name}" data-label="${label}" title="${title}" data-min-count="${minCount}" data-max-count="${maxCount}"
        ?is-editable="${isEditable}" ?is-deletable="${isDeletable}" ?is-moveable="${isMoveable}"
        ?is-always-show-delete="${isAlwaysShowDelete}" ?is-editing="${isEditing}"
        @dblclick="${dblclickHandlerDelegator}"
        ${ref(element => { runtime.setRootRef(element as HTMLDivElement) })}
      >
        ${runtime.tags.map(tag => tag.ref)}
        ${addPart}
      </div>
    `
  }
})
