import {
  Data, replayWithLatest
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeTableE } from '../elements/index'

import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { TableElementData } from '../elements/index'

export interface TableDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      data: TableElementData
    }
  }
  _internals: {
    styles: {
      data: TableElementData
    }
  }
}

/**
 *
 */
export const makeTableDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, TableDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const dataD = Data.empty<TableElementData>()
    const dataRD = replayWithLatest(1, dataD)

    return {
      inputs: {
        styles: {
          data: dataD
        }
      },
      _internals: {
        styles: {
          data: dataRD
        }
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeTableE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeTableDC}
 */
export const useTableDC = useGUIDriver_(makeTableDC)
