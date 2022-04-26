import {
  Data,
  replayWithLatest,
  binaryTweenPipeAtom,
  switchT, combineLatestT,
  makeGeneralEventHandler, makeGeneralCallback
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeButtonE } from '../elements/index'

import type { ClassUnion, EventHandler, SynthesizeEvent } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { ButtonElementType, ButtonValue } from '../elements/button'

export interface ButtonDCSchema {
  type: ButtonElementType
  name: string
  label: string
  title: string
  value: any
  content: any
  isDisabled: boolean
}

export interface ButtonDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      schema: ButtonDCSchema
      type: ButtonElementType
      classes: ClassUnion
      name: string
      label: string
      title: string
      value: any
      content: any
      isDisabled: boolean
    }
  }
  _internals: {
    styles: {
      type: ButtonElementType
      classes: ClassUnion
      name: string
      label: string
      title: string
      value: any
      content: any
      isDisabled: boolean
    }
    actuations: {
      clickHandler: EventHandler<HTMLDivElement>
      valueChangeHandler: (value: ButtonValue) => void
    }
  }
  outputs: {
    click: SynthesizeEvent<HTMLDivElement>
    value: ButtonValue
    schema: ButtonDCSchema
  }
}

/**
 * @param inputs.styles.type Type name of Button element. Constraint for the role form-group member.
 * @param inputs.styles.classes `classes` that will be added to root element of Button element structure.
 * @param inputs.styles.name Name of Button.
 * @param inputs.styles.label Label of Button, currently unused.
 * @param inputs.styles.title Title of Button, when you put your pointer on it, `title` will show just beside your pointer.
 * @param inputs.styles.value This value will be emitted when button be clicked instead of default ClickEvent.
 * @param inputs.styles.content Content of Button, default to string 'Just a button'.
 */
export const makeButtonDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, ButtonDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束
    const schemaInD = Data.empty<ButtonDCSchema>()
    const schemaOutRD = replayWithLatest(1, Data.empty<ButtonDCSchema>())

    // TODO: 将 schemaIn 映射到 styles
    // 组件 styles
    const classesD = Data.of<ClassUnion>('')
    const typeD = Data.of<ButtonElementType>('Button')
    const nameD = Data.of('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const valueD = Data.of<any>('')
    const contentD = Data.of<any>('Just a button')
    const isDisabledD = Data.of(false)

    const classesRD = replayWithLatest(1, classesD)
    const typeRD = replayWithLatest(1, typeD)
    const nameRD = replayWithLatest(1, nameD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const valueRD = replayWithLatest(1, valueD)
    const contentRD = replayWithLatest(1, contentD)
    const isDisabledRD = replayWithLatest(1, isDisabledD)

    // 组件核心逻辑
    const [clickHandlerRD, , clickD] = makeGeneralEventHandler<HTMLDivElement>()
    const clickRD = replayWithLatest(1, clickD)
    const [valueChangeHandlerRD, , buttonValueD] = makeGeneralCallback<ButtonValue>()
    const buttonValueRD = replayWithLatest(1, buttonValueD)

    // 表单项约束
    const stylesRD = replayWithLatest(1, combineLatestT({
      type: typeRD,
      name: nameRD,
      label: labelRD,
      title: titleRD,
      value: valueRD,
      content: contentRD,
      isDisabled: isDisabledRD
    }))
    // report button component styles for every happened click event
    binaryTweenPipeAtom(switchT(stylesRD, clickD), schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          classes: classesD,
          type: typeD,
          name: nameD,
          label: labelD,
          title: titleD,
          value: valueD,
          content: contentD,
          isDisabled: isDisabledD
        }
      },
      _internals: {
        styles: {
          classes: classesRD,
          type: typeRD,
          name: nameRD,
          label: labelRD,
          title: titleRD,
          value: valueRD,
          content: contentRD,
          isDisabled: isDisabledRD
        },
        actuations: {
          clickHandler: clickHandlerRD,
          valueChangeHandler: valueChangeHandlerRD
        }
      },
      outputs: {
        click: clickRD,
        value: buttonValueRD,
        schema: schemaOutRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeButtonE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeButtonDC}
 */
export const useButtonDC = useGUIDriver_(makeButtonDC)
