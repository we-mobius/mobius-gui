import { toClassString, makeUniqueString, debounceS } from 'MobiusUtils'
import { createElementMaker, ElementBaseRuntime } from '../../helpers/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions, ElementRuntimeOptions } from '../../helpers/index'

export type TagInputorElementType = 'TagInputor'
export interface TagInputorElementOptions extends ElementOptions {
  marks?: {
    id?: string
  }
  styles?: {
    /**
     * Type name of TagInputor element. Constraint for the role form-group member.
     */
    type?: TagInputorElementType
    /**
     * `classes` that will be added to root element of TagInputor element structure.
     */
    classes?: ClassUnion
    /**
     * Name of TagInputor.
     */
    name?: string
    /**
     * Label of TagInputor, currently unused.
     */
    label?: string
    /**
     * Title of TagInputor, when you put your pointer on it, `title` will show just beside your pointer.
     */
    title?: string
    text?: string
    /**
     * @default '标签'
     */
    placeholder?: string
    /**
     * Predicate whether the tag can be edit.
     *
     * @default true
     */
    isEditable?: boolean
    /**
     * Predicate whether the tag is deletable. If true, a delete button will be enabled.
     *
     * @default true
     */
    isDeletable?: boolean
    isMoveable?: boolean
    /**
     * When tag is `deletable`, predicate whether the delete button is always show, instead of show when mouse hover.
     *
     * @default false
     */
    isAlwaysShowDelete?: boolean
    /**
     * Predicate whether the tag is in editing mode.
     *
     * @default false
     */
    isEditing?: boolean
    validator?: (value: string) => {
      isValid: boolean
      reasons: string[]
    }
    modifier?: (value: string) => string
  }
  actuations?: {
    runtimeHandler?: (runtime: TagInputorRuntime) => void
    clickHandler?: (value: TagInputorValue) => void
    keydownHandler?: (event: SynthesizeEvent<HTMLInputElement> & KeyboardEvent) => void
    editHandler?: (value: TagInputorValue) => void
    inputHandler?: EventHandler<HTMLInputElement>
    changeHandler?: EventHandler<HTMLInputElement>
    exitHandler?: (value: TagInputorValue) => void
    deleteHandler?: (value: TagInputorValue) => void
    valueChangeHandler?: (value: TagInputorValue) => void
  }
}
export interface TagInputorValue {
  name: string
  label: string
  text: string
  value: string
  valueAsString: string
  isEditable: boolean
  isDeletable: boolean
  isMoveable: boolean
  isEditing: boolean
}

export class TagInputorRuntime extends ElementBaseRuntime<TagInputorElementOptions> {
  rootRef: HTMLDivElement | undefined
  tagRef: HTMLDivElement | undefined
  inputRef: HTMLInputElement | undefined

  constructor (options: ElementRuntimeOptions<TagInputorElementOptions>) {
    super(options)
    this.rootRef = undefined
    this.tagRef = undefined
    this.inputRef = undefined
  }

  get value (): TagInputorValue {
    const { name, label, text, isEditable, isDeletable, isMoveable, isEditing } = this.styles
    return {
      name: name,
      label: label,
      text: text,
      value: text,
      valueAsString: text,
      isEditable: isEditable,
      isDeletable: isDeletable,
      isMoveable: isMoveable,
      isEditing: isEditing
    }
  }

  setRootRef (ref: HTMLDivElement | undefined): void {
    this.rootRef = ref
  }

  setTagRef (ref: HTMLDivElement | undefined): void {
    this.tagRef = ref
  }

  /**
   * `setInputRef` 实际会在 input 元素实际挂载到页面上之后执行，
   * 如果此时 tag 被标记为 `isEditing`，则强制切换为编辑模式
   */
  setInputRef (ref: HTMLInputElement | undefined): void {
    this.inputRef = ref
    if (this.styles.isEditing) {
      this.enterEditingMode({ force: true })
    }
  }

  /**
   * 应该是唯一一个从 Input 元素中获取文本的方法
   */
  getTextFromInput (): void {
    if (this.inputRef !== undefined) {
      this.styles.text = this.inputRef.value
    }
  }

  setTextToInput (): void {
    if (this.inputRef !== undefined) {
      this.inputRef.value = this.styles.text
    }
  }

  setTextToTag (): void {
    if (this.tagRef !== undefined) {
      [...this.tagRef.childNodes].filter(node => node.nodeName === '#text')[0].nodeValue = this.styles.text
    }
  }

  syncTextFromRuntime (): void {
    this.setTextToInput()
    this.setTextToTag()
  }

  syncTextFromInput (): void {
    this.getTextFromInput()
    this.syncTextFromRuntime()
  }

  setText (text: string): void {
    this.styles.text = text
    this.syncTextFromRuntime()
  }

  modifyText (): void {
    this.styles.text = this.styles.modifier(this.styles.text)
  }

  validateText (): void {
    this.styles.validator(this.styles.text)
  }

  enterEditingMode ({ force }: { force: boolean } = { force: false }): void {
    if (this.styles.isEditing && !force) return
    if (this.rootRef !== undefined && this.inputRef !== undefined) {
      // 将 input 元素的值设置为 runtime 的最新值，确保其与 tag 的值一致
      this.syncTextFromRuntime()
      // 隐藏 tag，显示 input
      this.rootRef.classList.add('mobius-tag--editing')
      // input 元素获取焦点
      this.inputRef.focus()
      // 将光标移动到末尾
      this.inputRef.setSelectionRange(this.inputRef.value.length, this.inputRef.value.length)
      // 将 runtime 标记为编辑模式
      this.styles.isEditing = true
      this.rootRef.setAttribute('is-editing', 'true')
    }
  }

  exitEditingMode ({ force }: { force: boolean } = { force: false }): void {
    if (!this.styles.isEditing && !force) return
    if (this.rootRef !== undefined) {
      // 将 input 元素最新的值同步给 runtime 和 tag 中
      this.syncTextFromInput()
      this.modifyText()
      this.validateText()
      // 隐藏 input，显示 tag
      this.rootRef.classList.remove('mobius-tag--editing')
      // 将 runtime 标记为非编辑模式
      this.styles.isEditing = false
      this.rootRef.removeAttribute('is-editing')
    }
  }

  /**
   * 编辑模式下，将 input 的所有文本全部选中
   */
  selectAll (): void {
    if (this.inputRef !== undefined) {
      this.inputRef?.setSelectionRange(0, this.inputRef.value.length)
    }
  }
}

/**
 * @todo TODO: 双击进入编辑模式时，根据双击的位置设置光标位置
 */
export const makeTagInputorE = createElementMaker<TagInputorElementOptions>({
  marks: {
    id: ''
  },
  styles: {
    type: 'TagInputor',
    classes: '',
    name: '',
    label: '',
    title: '',
    text: '',
    placeholder: '标签',
    isEditable: true,
    isDeletable: true,
    isMoveable: false,
    isAlwaysShowDelete: false,
    isEditing: false,
    validator: (text: string) => ({ isValid: true, reasons: [] }),
    modifier: (text: string) => text.trim()
  },
  actuations: {
    runtimeHandler: runtime => { /** do nothing */ },
    clickHandler: value => { /** do nothing */ },
    keydownHandler: event => { /** do nothing */ },
    editHandler: value => { /** do nothing */ },
    inputHandler: event => { /** do nothing */ },
    changeHandler: event => { /** do nothing */ },
    exitHandler: value => { /** do nothing */ },
    deleteHandler: value => { /** do nothing */ },
    valueChangeHandler: value => { /** do nothing */ }
  },
  configs: {},
  prepareTemplate: (view, { marks, styles, actuations, configs, utils: { html, nothing, ref } }) => {
    const { id } = marks
    const {
      classes, name, label, title,
      text, placeholder, isEditable, isDeletable, isMoveable,
      isAlwaysShowDelete, isEditing
    } = styles

    const elementId = id !== '' ? id : makeUniqueString('mobius-tag-inputor')
    const inputId = `${elementId}__input`

    const runtime = new TagInputorRuntime({ marks, styles, actuations, configs })

    const {
      runtimeHandler,
      clickHandler, keydownHandler, editHandler, inputHandler, changeHandler, exitHandler,
      deleteHandler, valueChangeHandler
    } = actuations
    runtimeHandler(runtime)
    const debouncedValueChangeHandler = debounceS((value: TagInputorValue): void => {
      // 在值变化事件广播之前，如果标签已经不在编辑状态，且值为空文本，且`可删除`，则视为删除该标签
      // 并在值变化事件广播之后，触发删除事件（值变化应该发生在删除之前， 删除之后不应该有任何内容相关的事件发生）
      if (!runtime.styles.isEditing && isDeletable && value.text === '') {
        valueChangeHandler(value)
        deleteHandler(value)
      } else {
        valueChangeHandler(value)
      }
    }, 200)
    // 标签被单击的时候触发点击事件
    const clickHandlerDelegator = (event: SynthesizeEvent<HTMLDivElement>): void => {
      clickHandler(runtime.value)
    }
    // 标签被双击的时候触发编辑事件，并切换为编辑模式
    const editHandlerDelegator = (event: SynthesizeEvent<HTMLDivElement>): void => {
      editHandler(runtime.value)
      runtime.enterEditingMode()
    }
    // 当输入的内容发生变化的时候，触发`变化事件`，退出编辑模式，并触发`退出事件`、`值变化事件`
    const changeHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      changeHandler(event)
      runtime.exitEditingMode()
      exitHandler(runtime.value)
      debouncedValueChangeHandler(runtime.value)
    }
    // 当输入的时候，触发`输入`事件，记录最新的编辑内容，将其同步给标签元素，并触发`值变化事件`
    // NOTE: 虽然输入事件触发比较频繁，但标签场景中一般不会涉及到大段文字，所以简单的逻辑是没有必要防抖的
    const inputHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      inputHandler(event)
      runtime.syncTextFromInput()
      debouncedValueChangeHandler(runtime.value)
    }
    // 当输入框失焦的时候，退出编辑模式，并触发`退出事件`、`值变化事件`
    const blurHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement>): void => {
      runtime.exitEditingMode()
      exitHandler(runtime.value)
      debouncedValueChangeHandler(runtime.value)
    }
    // 当按下回车键的时候，退出编辑模式，并触发`退出事件`、`值变化事件`
    const keydownHandlerDelegator = (event: SynthesizeEvent<HTMLInputElement> & KeyboardEvent): void => {
      const { code } = event
      if (code === 'Enter') {
        runtime.exitEditingMode()
        exitHandler(runtime.value)
        debouncedValueChangeHandler(runtime.value)
      }
      keydownHandler(event)
    }
    // 当删除按钮被点击的时候，触发`删除`事件
    const deleteHandlerDelegator = (event: SynthesizeEvent<HTMLDivElement>): void => {
      deleteHandler(runtime.value)
    }

    const deletePart = isDeletable
      ? html`<div
          class="mobius-tag__delete ${isAlwaysShowDelete ? 'mobius-tag__delete--visible' : ''}"
          style="${isAlwaysShowDelete ? 'visibility: visible;' : ''}"
          title="点击删除该标签"
          @click="${deleteHandlerDelegator}"
        >×</div>`
      : nothing

    const dynamicClasses = {
      'mobius-tag--deletable': isDeletable,
      'mobius-tag--show-delete': isDeletable && isAlwaysShowDelete,
      'mobius-tag--editing': isEditing
    }

    return view`
      <div
        class="mobius-tag ${toClassString(classes)} ${toClassString(dynamicClasses)}"
        data-name="${name}" data-label="${label}" title="${title}"
        ?is-editable=${isEditable} ?is-deletable=${isDeletable} ?is-moveable=${isMoveable}
        ?is-always-show-delete=${isAlwaysShowDelete} ?is-editing=${isEditing}
        ${ref(element => runtime.setRootRef(element as HTMLDivElement))}
      >
        <div
          class="mobius-tag__text"
          title="${isEditable ? '双击以编辑标签' : ''}"
          @click="${clickHandlerDelegator}" @dblclick="${editHandlerDelegator}"
          ${ref(element => runtime.setTagRef(element as HTMLDivElement))}
        >${text}</div>
        <input
          id="${inputId}" class="mobius-tag__input" type="text" inputmode="text"
          name="${name}" value=${text} placeholder="${placeholder}"
          @input=${inputHandlerDelegator} @change=${changeHandlerDelegator}
          @blur="${blurHandlerDelegator}" @keydown="${keydownHandlerDelegator}"
          ${ref(element => runtime.setInputRef(element as HTMLInputElement))}
        >
        ${deletePart}
      </div>
    `
  }
})
