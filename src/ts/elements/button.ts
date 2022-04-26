import { debounceS } from 'MobiusUtils'
import { createElementMaker, toClassString } from '../helpers/index'

import type { EventHandler, ClassUnion, SynthesizeEvent } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export type ButtonElementType = 'Button'
export interface ButtonElementOptions extends ElementOptions {
  styles?: {
    /**
     * Type name of Button element. Constraint for the role form-group member.
     */
    type?: ButtonElementType
    /**
     * `classes` that will be added to root element of Button element structure.
     */
    classes?: ClassUnion
    /**
     * Name of Button.
     */
    name?: string
    /**
     * Label of Button, currently unused.
     */
    label?: string
    /**
     * Title of Button, when you put your pointer on it, `title` will show just beside your pointer.
     */
    title?: string
    /**
     * This value will be emitted when button be clicked instead of default ClickEvent.
     */
    value?: any
    /**
     * Content of Button, default to string 'Just a button'.
     * @default 'Just a button'
     */
    content?: any
    /**
     * Indicate if button is disabled.
     * @default false
     */
    isDisabled?: boolean
  }
  actuations?: {
    /**
     * Even if the button is disabled, it can still be clicked, and `clickHandler` will always be called.
     */
    clickHandler?: EventHandler<HTMLDivElement>
    /**
     * When button is disabled, i.e. `styles.isDisabled` is true, this handler will not be called.
     *
     * If you want to monitor click action at any time, regardless of the disabled status of the button,
     * you can use `clickHandler` instead.
     */
    valueChangeHandler?: (value: ButtonValue) => void
  }
}
export interface ButtonValue {
  name: string
  label: string
  value: any
  clickedTimes: number
  deltaClickedTimes: number
}

/**
 * @param styles.type Type name of Button element. Constraint for the role form-group member.
 * @param styles.classes `classes` that will be added to root element of Button element structure.
 * @param styles.name Name of Button.
 * @param styles.label Label of Button, currently unused.
 * @param styles.title Title of Button, when you put your pointer on it, `title` will show just beside your pointer.
 * @param styles.value This value will be emitted when button be clicked instead of default ClickEvent.
 * @param styles.content Content of Button, default to string 'Just a button'.
 * @param actuations.clickHandler Button click handler.
 * @param actuations.valueChangeHandler Button value change handler.
 */
export const makeButtonE = createElementMaker<ButtonElementOptions>({
  marks: {},
  styles: {
    type: 'Button',
    classes: '',
    name: '',
    label: '',
    title: '',
    value: '',
    content: 'Just a button',
    isDisabled: false
  },
  actuations: {
    clickHandler: event => event,
    valueChangeHandler: value => value
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations }) => {
    const { classes, name, label, title, value, content, isDisabled } = styles
    const classesString = toClassString(classes)

    const { clickHandler, valueChangeHandler } = actuations
    const _buttonStates = {
      clickedTimes: 0,
      lastClickedTimes: 0
    }
    const getDeltaClickedTimes = (): number => {
      const delta = _buttonStates.clickedTimes - _buttonStates.lastClickedTimes
      _buttonStates.lastClickedTimes = _buttonStates.clickedTimes
      return delta
    }
    // valueChangeHandler 最终被实际执行的时候再调用 `getDeltaClickedTimes` 以获取正确的点击次数
    const debouncedValueChangeHandler = debounceS(
      (value: ButtonValue) => valueChangeHandler({ ...value, deltaClickedTimes: getDeltaClickedTimes() }),
      200
    ) as ((value: Omit<ButtonValue, 'deltaClickedTimes'>) => void)
    const clickHandlerDelegator = (event: SynthesizeEvent<HTMLDivElement>): void => {
      // 将点击事件第一时间传递给正常的点击事件监听逻辑中
      clickHandler(event)
      // 然后再执行自定义逻辑
      if (!isDisabled) {
        _buttonStates.clickedTimes += 1
        debouncedValueChangeHandler({ name, label, value, clickedTimes: _buttonStates.clickedTimes })
      }
    }

    return view`
      <div
        role="button" name=${'name'} class="mobius-cursor--pointer ${isDisabled ? 'mobius-button--disabled' : 'mobius-button'} ${classesString}"
        title=${title} @click=${clickHandlerDelegator} data-label=${label} data-value=${'value'} data-is-disabled=${isDisabled}
      >
        ${content}
      </div>
    `
  }
})
