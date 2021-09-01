import {
  Data,
  replayWithLatest,
  makeGeneralEventHandler
} from '../libs/mobius-utils.js'
import {
  makeDriverFormatComponent, useUIDriver
} from '../helpers/index.js'
import { makeToolbarE } from '../elements/index.js'

export const toolbarDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const positionRD = replayWithLatest(1, Data.empty())
    const directionRD = replayWithLatest(1, Data.empty())
    const itemsRD = replayWithLatest(1, Data.empty())
    const [eventHandlerRD, , eventD] = makeGeneralEventHandler(e => ({ event: e, payload: { ...e.target.dataset } }))

    return {
      inputs: {
        styles: {
          position: positionRD,
          direction: directionRD,
          items: itemsRD
        }
      },
      _internals: {
        styles: {
          position: positionRD,
          direction: directionRD,
          items: itemsRD
        },
        actuations: {
          eventHandler: eventHandlerRD
        }
      },
      outputs: {
        event: eventD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, { html }) => {
    return makeToolbarE({ marks, styles, actuations, configs })
  }
})

export const useToolbarDC = useUIDriver(toolbarDC)
