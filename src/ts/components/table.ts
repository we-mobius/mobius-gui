import { makeDriverFormatComponent, useUIDriver } from '../helpers/index'
import { makeTableE } from '../elements/index'
import {
  Data
} from '../libs/mobius-utils'

/**
 * @param { object } options
 * @return Data of TemplateResult
 */
export const tableDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const dataD = Data.empty()

    return {
      inputs: {
        styles: {
          data: dataD
        }
      },
      _internals: {
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

export const useTableDC = useUIDriver(tableDC)
