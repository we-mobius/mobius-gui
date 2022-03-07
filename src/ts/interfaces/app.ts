import { makeInstantComponent } from 'Helpers/index'
import { makeMiddleColAdaptiveLayoutE } from 'Elements/layout__middle-col-adaptive'

import { dockRD } from 'Interfaces/dock'
import { homeRD } from 'Interfaces/pages/home/home'

import { appNameRD } from 'Interfaces/services/app-route'

export const appTemplateRD = makeInstantComponent(
  [appNameRD, dockRD, homeRD],
  ([appName, dock, home], template, mutation, { html }) => {
    const apps: Record<string, any> = {
      home: home
    }

    const view = makeMiddleColAdaptiveLayoutE({
      styles: {
        rootClasses: 'size--fullpct',
        left: dock,
        middle: apps[appName]
      }
    })
    return view
  }
)
