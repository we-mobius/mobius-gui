import { makeDriverFormatComponent, useUIDriver } from '../helpers/index'
import { makeButtonE } from '../elements/index'
import {
  Data,
  replayWithLatest,
  binaryTweenPipeAtom,
  switchT, combineLatestT, tapValueT,
  makeGeneralEventHandler
} from '../libs/mobius-utils'

/**
 * @param marks
 * @param styles Object
 * @param actuations
 * @param configs
 * @return driver
 */
export const buttonDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束
    const schemaInD = Data.empty()
    const schemaOutRD = replayWithLatest(1, Data.empty())

    // TODO: 将 schemaIn 映射到 styles
    // 组件 styles
    const nameInD = Data.empty()
    const typeInD = Data.empty()
    const labelInD = Data.empty()

    const nameRD = replayWithLatest(1, Data.of(''))
    const typeRD = replayWithLatest(1, Data.of('Button'))
    const labelRD = replayWithLatest(1, Data.of(''))

    binaryTweenPipeAtom(nameInD, nameRD)
    binaryTweenPipeAtom(typeInD, typeRD)
    binaryTweenPipeAtom(labelInD, labelRD)

    // 组件核心逻辑
    const [clickHandlerRD, , clickD] = makeGeneralEventHandler()

    // 表单项约束
    const stylesRD = replayWithLatest(1, combineLatestT({
      name: nameRD,
      type: typeRD,
      label: labelRD
    }))
    binaryTweenPipeAtom(switchT(stylesRD, clickD), schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          name: nameInD,
          type: typeInD,
          label: labelInD
        }
      },
      outputs: {
        click: clickD
      },
      _internals: {
        marks: {},
        styles: {
          name: nameRD,
          type: typeRD,
          label: labelRD
        },
        actuations: {
          clickHandler: clickHandlerRD
        },
        configs: {}
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeButtonE({ marks, styles, actuations, configs })
  }
})

export const useButtonDC = useUIDriver(buttonDC)
