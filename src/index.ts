import 'Styles/style.css'

import { runSimpleApp } from './main'
import { initAppTheme } from './ts/libs/mobius-services'

import { appTemplateRD } from 'Interfaces/app'

initAppTheme({
  enableAutoToggle: true,
  isExpectUnknown: false
})

runSimpleApp(
  'mobius-app',
  appTemplateRD,
  {
    decorator: {
      className: 'mobius-app mobius-select--none',
      innerHTML: ''
    }
  }
)
