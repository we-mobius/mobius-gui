import {
  isVacuo,
  Data, Mutation, TERMINATOR,
  replayWithLatest,
  pipeAtom, binaryTweenPipeAtom, makeGeneralEventHandler,
  pluckT, combineLatestT, mapT,
  tapValueT
} from '../../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../../helpers/index'
import { makeFileInputE } from '../../elements/inputs/input__file'

import type { EventHandler } from '../../libs/mobius-utils'
import type { TemplateResult } from '../../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../../helpers/index'
import type { FileInputElementType } from '../../elements/inputs/input__file'

export interface FileInputDCSchema {
  styles: {
    type: FileInputElementType
    name: string
    label: string
    accept: string
    multiple: boolean
  }
  contents: any
  value: any
}

export interface FileInputDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      schema: FileInputDCSchema
      type: FileInputElementType
      name: string
      label: string
      accept: string
      multiple: boolean
    }
  }
  _internals: {
    styles: {
      type: FileInputElementType
      name: string
      label: string
      accept: string
      multiple: boolean
    }
    actuations: {
      changeHandler: EventHandler<HTMLInputElement>
    }
  }
  outputs: {
    schema: FileInputDCSchema
  }
}

/**
 *
 */
export const makeFileInputDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, FileInputDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束 - 接口
    const schemaInD = Data.empty<FileInputDCSchema>()
    const schemaOutRD = replayWithLatest(1, Data.empty<FileInputDCSchema>())
    tapValueT('FileInputSchemaOutRD', schemaOutRD)

    // TODO: 将 schemaIn 映射到 styles
    // 组件 styles
    const nameD = Data.of('')
    const typeD = Data.of<FileInputElementType>('FileInput')
    const labelD = Data.of('')
    const acceptD = Data.of('')
    const multipleD = Data.of(false)

    const nameRD = replayWithLatest(1, nameD)
    const typeRD = replayWithLatest(1, typeD)
    const labelRD = replayWithLatest(1, labelD)
    const acceptRD = replayWithLatest(1, acceptD)
    const multipleRD = replayWithLatest(1, multipleD)

    // 组件核心逻辑
    const [changeHandlerRD, , changeD] = makeGeneralEventHandler<HTMLInputElement>()
    const changeRD = replayWithLatest(1, changeD)

    const filesD: Data<FileList> = pluckT('target.files', changeD)

    const filesToContentsM = Mutation.ofLiftLeft<FileList, any>((files, _, mutation) => {
      if (isVacuo(files)) return TERMINATOR

      const promises = Array.from(files).map(async file => {
        return await new Promise<FileReader['result'] | undefined>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = event => {
            resolve(event?.target?.result)
          }
          reader.readAsText(file)
        })
      })

      void Promise.allSettled(promises).then(settledResult => {
        mutation!.triggerTransformation(() => {
          return settledResult.map((res) => {
            if (res.status === 'fulfilled') {
              return res.value
            }
            return res.reason
          })
        })
      })

      return TERMINATOR
    })
    const contentsD = Data.empty<any>()
    pipeAtom(filesD, filesToContentsM, contentsD)
    tapValueT('contentsD', contentsD)

    // 表单项约束
    const stylesRD = replayWithLatest(1, combineLatestT({
      name: nameRD,
      type: typeRD,
      label: labelRD,
      accept: acceptRD,
      multiple: multipleRD
    }))
    const rawSchemaD = combineLatestT({ styles: stylesRD, contents: contentsD })
    const innerSchemaD = mapT(rawSchema => {
      const { styles, contents } = rawSchema
      return { ...styles, contents, value: contents }
    }, rawSchemaD)
    binaryTweenPipeAtom(innerSchemaD, schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          name: nameD,
          type: typeD,
          label: labelD,
          accept: acceptD,
          multiple: multipleD
        }
      },
      _internals: {
        styles: {
          name: nameRD,
          type: typeRD,
          label: labelRD,
          accept: acceptRD,
          multiple: multipleRD
        },
        actuations: {
          changeHandler: changeHandlerRD
        }
      },
      outputs: {
        schema: schemaOutRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeFileInputE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeFileInputDC}
 */
export const useFileInputDC = useGUIDriver_(makeFileInputDC)
