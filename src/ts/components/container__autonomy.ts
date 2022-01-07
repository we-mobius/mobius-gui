import {
  makeUniqueString,
  Data,
  replayWithLatest,
  takeBeforeSwitchT, mapT, combineLatestT
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_, idToElementT } from '../helpers/index'

import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export interface AutonomyContainerDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      rootClasses: string
      content: any
    }
  }
  _internals: {
    marks: {
      containerId: string
      hostId: string
    }
    styles: {
      rootClasses: string
      content: any
    }
  }
  outputs: {
    containerId: string
    container: HTMLDivElement
    hostId: string
    host: HTMLDivElement
    materials: { container: HTMLDivElement, host: HTMLDivElement }
    app: any
  }
}

/**
 * @todo TODO: static styles continuous setting logic
 */
export const makeAutonomyContainerDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, AutonomyContainerDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const rootClassesD = Data.empty<string>()
    const rootClassesRD = replayWithLatest(1, rootClassesD)
    const contentD = Data.of<any>(undefined)
    const contentRD = replayWithLatest(1, contentD)

    const containerIdRD = replayWithLatest(1, Data.of(makeUniqueString('autonomy-container')))
    const containerRD = replayWithLatest(1, idToElementT<HTMLDivElement>(100, containerIdRD))
    const hostIdRD = replayWithLatest(1, mapT((id) => `${id}__host`, containerIdRD))
    const hostRD = replayWithLatest(1, idToElementT<HTMLDivElement>(100, hostIdRD))

    const materialsRD = replayWithLatest(1, combineLatestT({ container: containerRD, host: hostRD }))

    return {
      inputs: {
        styles: {
          rootClasses: rootClassesD,
          content: contentD
        }
      },
      _internals: {
        marks: {
          containerId: containerIdRD,
          hostId: hostIdRD
        },
        styles: {
          rootClasses: rootClassesRD,
          content: contentRD
        }
      },
      outputs: {
        containerId: containerIdRD,
        container: containerRD,
        hostId: hostIdRD,
        host: hostRD,
        materials: materialsRD,
        app: replayWithLatest(1, Data.of(''))
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, { html }) => {
    const { containerId, hostId } = marks
    const { rootClasses, content } = styles

    return html`
      <div id=${containerId} class="mobius-size--fullpct mobius-scroll--bar-hidden">
        <div id=${hostId} class="mobius-size--fullpct mobius-scroll--bar-hidden">${content === undefined ? 'Awesome autonomy container!' : content}</div>
      </div>
    `
  },
  prepareInstance: (options, instance) => {
    const { template, container } = instance.outputs
    instance.outputs.app = replayWithLatest(1, takeBeforeSwitchT<any>(template, container))
    return instance
  }
})

/**
 * @see {@link makeAutonomyContainerDC}
 */
export const useAutonomyContainerDC = useGUIDriver_(makeAutonomyContainerDC)
