import { makeUIDriver, useUIDriver } from '../helpers/index.js'
import { makeTableE } from '../elements/index.js'
import {
  Data
} from '../libs/mobius-utils.js'

/**
 * @param { object } options
 * @return Data of TemplateResult
 */
export const tableUIDriver = makeUIDriver({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const dataD = Data.empty()

    return {
      inputs: {
        styles: {
          data: dataD
        }
      },
      internals: {
        styles: {
          data: dataD
        }
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeTableE({ marks, styles, actuations, configs })
  }
})

export const useTableC = useUIDriver(tableUIDriver)
