import {
  Data,
  replayWithLatest,
  binaryTweenPipeAtom,
  switchT, combineLatestT,
  makeGeneralEventHandler
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeButtonE } from '../elements/index'

import type { EventHandler, SynthesizeEvent } from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { ButtonElementType } from '../elements/index'

export interface ButtonDCSchema {
  type: ButtonElementType
  name: string
  label: string
}

export interface ButtonDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      schema: ButtonDCSchema
      type: ButtonElementType
      name: string
      label: string
    }
  }
  _internals: {
    styles: {
      type: ButtonElementType
      name: string
      label: string
    }
    actuations: {
      clickHandler: EventHandler<HTMLButtonElement>
    }
  }
  outputs: {
    click: SynthesizeEvent<HTMLButtonElement>
    schema: ButtonDCSchema
  }
}

/**
 * @param inputs.styles.type Constraint for the role form-group member.
 * @param inputs.styles.name Button name.
 * @param inputs.styles.label Button label.
 */
export const makeButtonDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, ButtonDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束
    const schemaInD = Data.empty<ButtonDCSchema>()
    const schemaOutRD = replayWithLatest(1, Data.empty<ButtonDCSchema>())

    // TODO: 将 schemaIn 映射到 styles
    // 组件 styles
    const nameD = Data.of('')
    const typeD = Data.of<ButtonElementType>('Button')
    const labelD = Data.of('')
    const nameRD = replayWithLatest(1, nameD)
    const typeRD = replayWithLatest(1, typeD)
    const labelRD = replayWithLatest(1, labelD)

    // 组件核心逻辑
    const [clickHandlerRD, , clickD] = makeGeneralEventHandler<HTMLButtonElement>()
    const clickRD = replayWithLatest(1, clickD)

    // 表单项约束
    const stylesRD = replayWithLatest(1, combineLatestT({
      name: nameRD,
      type: typeRD,
      label: labelRD
    }))
    // report button component styles for every happened click event
    binaryTweenPipeAtom(switchT(stylesRD, clickD), schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          name: nameD,
          type: typeD,
          label: labelD
        }
      },
      _internals: {
        styles: {
          name: nameRD,
          type: typeRD,
          label: labelRD
        },
        actuations: {
          clickHandler: clickHandlerRD
        }
      },
      outputs: {
        click: clickRD,
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
