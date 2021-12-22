import 'Styles/style.css'

import { completeStateRD } from './ts/libs/mobius-utils'
import { makeAppContainerRD, runApp } from './main'
import { initConfig, initTheme } from './ts/libs/mobius-services'

import { appTemplateRD } from 'Interfaces/app'

// initConfig()
initTheme({
  isAutoToggle: () => 'open'
})

completeStateRD.subscribe(() => {
  console.log('[Application] initialize start!')

  const appContainerRD = makeAppContainerRD('mobius-app', {
    className: 'mobius-app'
  })
  runApp(appContainerRD, appTemplateRD)

  console.log('[Application] initialize ended!')
})
