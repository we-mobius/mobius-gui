import {
  isString, isObject,
  makeUniqueString,
  Data,
  replayWithLatest,
  combineLatestT, mapT, takeT_, mapT_, filterT_, takeBeforeSwitchT
} from '../libs/mobius-utils'
import { neatenJavaScriptLoadOptions } from '../libs/mobius-services'
import { makeDriverFormatComponent, useGUIDriver_, idToElementT } from '../helpers/index'

import type {
  JavaScriptLoadOptions, SingleJavaScriptLoadOptions, JavaScriptCollection, JavaScriptCollectionExternalItem
} from '../libs/mobius-services'
import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export interface AutonomyAppDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      rootClasses: string
      content: any
    }
    actuations: {
      startSignal: any
      scriptsOptions: JavaScriptLoadOptions
      javascriptCollection: JavaScriptCollection
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
    scripts: JavaScriptCollectionExternalItem[]
    materials: { scripts: JavaScriptCollectionExternalItem[], container: HTMLDivElement, host: HTMLDivElement }
    preparedJavaScriptLoadOptions: SingleJavaScriptLoadOptions[]
    app: any
  }
}

/**
 * @todo TODO: static styles continuous setting logic
 */
export const makeAutonomyAppDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, AutonomyAppDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const rootClassesD = Data.empty<string>()
    const rootClassesRD = replayWithLatest(1, rootClassesD)
    const contentD = Data.of<any>(undefined)
    const contentRD = replayWithLatest(1, contentD)

    const containerIdRD = replayWithLatest(1, Data.of(makeUniqueString('autonomy-app')))
    const containerRD = replayWithLatest(1, idToElementT<HTMLDivElement>(100, containerIdRD))
    const hostIdRD = replayWithLatest(1, mapT((id) => `${id}__host`, containerIdRD))
    const hostRD = replayWithLatest(1, idToElementT<HTMLDivElement>(100, hostIdRD))

    // step1: prepare
    const startSignalD = Data.empty<any>()
    const startSignalRD = replayWithLatest(1, startSignalD)
    const scriptsOptionsD = Data.empty<JavaScriptLoadOptions>()
    const scriptsOptionsRD = replayWithLatest(1, scriptsOptionsD)

    // step2: load scripts
    // when startSignal arrives, emit JavaScriptLoadOptions
    const preparedJavaScriptLoadOptionsD: Data<SingleJavaScriptLoadOptions[]> = combineLatestT(scriptsOptionsRD, startSignalRD).pipe(
      takeT_(1),
      mapT_(([script]) => neatenJavaScriptLoadOptions(script))
    )
    const preparedJavaScriptLoadOptionsRD = replayWithLatest(1, preparedJavaScriptLoadOptionsD)

    // step3: extract scripts loaded from javascriptCollection in which matches javascriptLoadOptions
    const javascriptCollectionD = Data.empty<JavaScriptCollection>()
    const scriptsLoadedD = combineLatestT(preparedJavaScriptLoadOptionsD, javascriptCollectionD).pipe(
      filterT_(([options, loaded]) => {
        const { external } = loaded
        return options.every(item => {
          if (!isString(item) && !isObject(item)) {
            throw (new TypeError(`"item" is expected to be type of String | Object, but received "${typeof item}".`))
          }
          const src = isString(item) ? item : item.src
          if (src === undefined) {
            throw (new TypeError('"src" field of item is expected to be type of String, but received "undefined".'))
          }

          return external.some(i => i.src === src)
        })
      }),
      takeT_(1),
      mapT_(([options, { external }]) => {
        return options.map(i => external.find(j => i.src === j.src))
      })
    ) as unknown as Data<JavaScriptCollectionExternalItem[]>
    const scriptsLoadedRD = replayWithLatest(1, scriptsLoadedD)

    // step4:
    const materialsRD = replayWithLatest(1, combineLatestT({ scripts: scriptsLoadedRD, container: containerRD, host: hostRD }))

    return {
      inputs: {
        styles: {
          rootClasses: rootClassesD,
          content: contentD
        },
        actuations: {
          startSignal: startSignalD,
          scriptsOptions: scriptsOptionsD,
          javascriptCollection: javascriptCollectionD
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
        scripts: scriptsLoadedRD,
        materials: materialsRD,
        preparedJavaScriptLoadOptions: preparedJavaScriptLoadOptionsRD,
        app: replayWithLatest(1, Data.of(''))
      }
    }
  },
  prepareTemplate: ({ marks, styles }, template, mutation, { html }) => {
    const { containerId, hostId } = marks
    const { rootClasses, content } = styles

    return html`
      <div id=${containerId} class="mobius-size--fullpct mobius-scroll--bar-hidden">
        <!-- <div id=${hostId} class="mobius-size--fullpct mobius-scroll--bar-hidden">${content === undefined ? 'Awesome autonomy app!' : content}</div> -->
        <div id=${hostId} class="mobius-size--fullpct mobius-scroll--bar-hidden"></div>
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
 * @see {@link makeAutonomyAppDC}
 */
export const useAutonomyAppDC = useGUIDriver_(makeAutonomyAppDC)
