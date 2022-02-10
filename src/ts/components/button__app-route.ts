import {
  Data, TERMINATOR,
  replayWithLatest, binaryTweenPipeAtom,
  makeGeneralEventHandler
} from 'MobiusUtils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeButtonE } from '../elements/index'

import type { ClassUnion, SynthesizeEvent, EventHandler } from 'MobiusUtils'
import type { AppRouteDriverInstance } from 'MobiusServices'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'

export interface AppRouteButtonDCDriverOptions extends GUIDriverOptions {
  appRouteDriverInstance: AppRouteDriverInstance
}
export interface AppRouteButtonDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      classes: ClassUnion
      name: string
      label: string
      title: string
      value: any
      content: any
    }
  }
  _internals: {
    styles: {
      classes: ClassUnion
      name: string
      label: string
      title: string
      value: any
      content: any
    }
    actuations: {
      clickHandler: EventHandler<HTMLDivElement>
    }
  }
  outputs: {
    click: SynthesizeEvent<HTMLDivElement>
  }
}

export const makeAppRouteButtonDC =
makeDriverFormatComponent<AppRouteButtonDCDriverOptions, GUIDriverLevelContexts, AppRouteButtonDCSingletonLevelContexts>({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const classesD = Data.of<ClassUnion>('')
    const nameD = Data.of('')
    const labelD = Data.of('')
    const titleD = Data.of('')
    const valueD = Data.of<any>('')
    const contentD = Data.of('This is an app route button')

    const classesRD = replayWithLatest(1, classesD)
    const nameRD = replayWithLatest(1, nameD)
    const labelRD = replayWithLatest(1, labelD)
    const titleRD = replayWithLatest(1, titleD)
    const valueRD = replayWithLatest(1, valueD)
    const contentRD = replayWithLatest(1, contentD)

    const [clickHandlerRD, , clickD] = makeGeneralEventHandler<HTMLDivElement, any>((event) => {
      const value = event.target.dataset.value
      return value === undefined ? TERMINATOR : value
    })
    const clickRD = replayWithLatest(1, clickD)

    const { inputs: { navigate } } = options.appRouteDriverInstance
    binaryTweenPipeAtom(clickD, navigate)

    return {
      inputs: {
        styles: {
          classes: classesD,
          name: nameD,
          label: labelD,
          title: titleD,
          value: valueD,
          content: contentD
        }
      },
      _internals: {
        styles: {
          classes: classesRD,
          name: nameRD,
          label: labelRD,
          title: titleRD,
          value: valueRD,
          content: contentRD
        },
        actuations: {
          clickHandler: clickHandlerRD
        }
      },
      outputs: {
        click: clickRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeButtonE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeAppRouteButtonDC}
 */
export const useAppRouteButtonDC = useGUIDriver_(makeAppRouteButtonDC)
