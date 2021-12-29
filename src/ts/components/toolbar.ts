import {
  Data,
  replayWithLatest,
  makeGeneralEventHandler
} from '../libs/mobius-utils'
import {
  makeDriverFormatComponent, useGUIDriver_
} from '../helpers/index'
import { makeToolbarE } from '../elements/index'

import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { ToolbarElementDirection, ToolbarElementItem } from '../elements/index'

export interface ToolbarDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      position: string
      direction: ToolbarElementDirection
      items: Array<ToolbarElementItem | ToolbarElementItem[]>
    }
  }
  _internals: {
    styles: {
      position: string
      direction: ToolbarElementDirection
      items: Array<ToolbarElementItem | ToolbarElementItem[]>
    }
    actuations: {
      eventHandler: (event: Event) => void
    }
  }
  outputs: {
    event: any
  }
}

/**
 *
 */
export const makeToolbarDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, ToolbarDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const positionD = Data.empty<string>()
    const positionRD = replayWithLatest(1, positionD)
    const directionD = Data.empty<ToolbarElementDirection>()
    const directionRD = replayWithLatest(1, directionD)
    const itemsD = Data.empty<Array<ToolbarElementItem | ToolbarElementItem[]>>()
    const itemsRD = replayWithLatest(1, itemsD)

    const [eventHandlerRD, , eventD] = makeGeneralEventHandler(event => ({
      event: event, payload: { ...(event?.target as HTMLDivElement)?.dataset }
    }))
    const eventRD = replayWithLatest(1, eventD)

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
        event: eventRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, { html }) => {
    return makeToolbarE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeToolbarDC}
 */
export const useToolbarDC = useGUIDriver_(makeToolbarDC)
