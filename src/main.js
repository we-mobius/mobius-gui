import './statics/styles/style.css'

import run from '@cycle/rxjs-run'
import { main } from './pages/index'
import { makeDOMDriver } from '@cycle/dom'

import initMobiusUI from './statics/js/mobius-css.js'
import {
  initConfig, initAuth, initTheme, initRequest, makeConfigObserver,
  getConfig, authObservers,
  whenContentLoaded
} from './libs/mobius.js'

whenContentLoaded(async () => {
  // 初始化 Mobius UI（引入 Houdini 等渐进增强）
  initMobiusUI()

  // NOTE: 初始化配置，在初始化应用其它业务之前进行
  await initConfig({
    data: {
      config: {
        requestInfo: {
          getConfigUrl: 'https://f9qgkjyi.minapp-faas.com/prod/main/',
          setConfigUrl: 'https://f9qgkjyi.minapp-faas.com/prod/main/'
        }
      },
      auth: {
        authingOptions: {
          userPoolId: '5ea0fce451bb8d949f7e1701'
        }
      }
    },
    repository: {
      auth: {
        saveTo: 'runtime'
      }
    }
  })

  initRequest({
    withToken: true // default to true
  })

  await initAuth()

  await authObservers.select('login').next({
    email: 'kcigaret@outlook.com',
    password: 'kxy062498.00'
  })
  // .then(() => {
  //   return authObservers.select('userinfo').next().then(() => { console.info('userInfo got!') })
  // })
  // .then(() => {
  //   authObservers.select('logout').next().then(() => { console.info('logout') })
  // })

  setTimeout(() => {
    makeConfigObserver().next({
      repository: {
        auth: {
          saveTo: 'local'
        }
      }
    })
  }, 3000)

  initTheme({
    // modeHandler: mode => {},
    // lightSourceHandler: lightSource => {},
    isAutoToggle: () => getConfig('service.theme.autoToggle')
  })

  // const hoverSupported =
  //   getComputedStyle(document.body, '::before').content === 'none'
  // console.info('hover_supported:', hoverSupported)

  // 启动应用
  run(main, {
    DOM: makeDOMDriver('#app')
  })
})
