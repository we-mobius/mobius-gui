import { makeComponentMaker } from '../helpers/index.js'
import { makeFileInputE } from '../elements/input__file.js'
import {
  Data, Mutation, TERMINATOR,
  pipeAtom, binaryTweenPipeAtom, makeGeneralEventHandler,
  pluckT, combineLatestT, mapT,
  tapValueT
} from '../libs/mobius-utils.js'

export const makeFileInputC = makeComponentMaker({
  prepareSingletonLevelContexts: ({ styles }, { useOutputs }) => {
    const schemaOutD = useOutputs('schemaOut', {})

    const [changeHandlerRD, , changeD] = makeGeneralEventHandler()

    const filesD = changeD.pipe(pluckT('target.files'))

    const filesToContentsM = Mutation.ofLiftLeft((files, _, mutation) => {
      const promises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            resolve(e.target.result)
          }
          reader.readAsText(file)
        })
      })

      Promise.allSettled(promises).then(res => {
        mutation.triggerOperation(() => res.map(({ value }) => value))
      })

      return TERMINATOR
    })
    const contentsD = Data.empty()
    tapValueT('contentsD')(contentsD)

    const rawSchemaD = combineLatestT({ styles, contents: contentsD })
    const innerSchemaD = rawSchemaD.pipe(mapT(rawSchema => {
      const { styles, contents } = rawSchema
      return { ...styles, contents, value: contents }
    }))
    tapValueT('innerSchemaD')(innerSchemaD)
    binaryTweenPipeAtom(innerSchemaD, schemaOutD)

    pipeAtom(filesD, filesToContentsM, contentsD)

    return {
      changeHandler: changeHandlerRD
    }
  },
  handler: ({ marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts }) => {
    actuations = { ...actuations, changeHandler: singletonLevelContexts.changeHandler }

    return makeFileInputE({ marks, styles, actuations, configs })
  }
})
