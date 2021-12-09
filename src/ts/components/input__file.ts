import { makeDriverFormatComponent, useUIDriver } from '../helpers/index'
import { makeFileInputE } from '../elements/input__file'
import {
  Data, Mutation, TERMINATOR,
  replayWithLatest,
  pipeAtom, binaryTweenPipeAtom, makeGeneralEventHandler,
  pluckT_, combineLatestT, mapT_,
  tapValueT
} from '../libs/mobius-utils'

export const fileInputDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // 表单项约束 - 接口
    const schemaInD = Data.empty()
    const schemaOutRD = replayWithLatest(1, Data.empty())
    tapValueT('FileInputSchemaOutRD', schemaOutRD)

    // TODO: 将 schemaIn 映射到 styles
    // 组件 styles
    const nameInD = Data.empty()
    const typeInD = Data.empty()
    const labelInD = Data.empty()
    const acceptInD = Data.empty()
    const multipleInD = Data.empty()

    const nameRD = replayWithLatest(1, Data.of(''))
    const typeRD = replayWithLatest(1, Data.of('FileInput'))
    const labelRD = replayWithLatest(1, Data.of(''))
    const acceptRD = replayWithLatest(1, Data.of(''))
    const multipleRD = replayWithLatest(1, Data.of(false))

    binaryTweenPipeAtom(nameInD, nameRD)
    binaryTweenPipeAtom(typeInD, typeRD)
    binaryTweenPipeAtom(labelInD, labelRD)
    binaryTweenPipeAtom(acceptInD, acceptRD)
    binaryTweenPipeAtom(multipleInD, multipleRD)

    // 组件核心逻辑
    const [changeHandlerRD, , changeD] = makeGeneralEventHandler()

    const filesD = changeD.pipe(pluckT_('target.files'))

    const filesToContentsM = Mutation.ofLiftLeft((files, _, mutation) => {
      const promises = Array.from(files).map(async file => {
        return await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            resolve(e.target.result)
          }
          reader.readAsText(file)
        })
      })

      Promise.allSettled(promises).then(res => {
        mutation.triggerTransformation(() => res.map(({ value }) => value))
      })

      return TERMINATOR
    })
    const contentsD = Data.empty()
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
    const innerSchemaD = rawSchemaD.pipe(mapT_(rawSchema => {
      const { styles, contents } = rawSchema
      return { ...styles, contents, value: contents }
    }))
    binaryTweenPipeAtom(innerSchemaD, schemaOutRD)

    return {
      inputs: {
        styles: {
          schema: schemaInD,
          name: nameInD,
          type: typeInD,
          label: labelInD,
          accept: acceptInD,
          multiple: multipleInD
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

export const useFileInputDC = useUIDriver(fileInputDC)
