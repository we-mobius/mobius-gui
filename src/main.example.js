import './statics/styles/style.css'

import run from '@cycle/rxjs-run'
import { main } from './pages/index'
import { makeDOMDriver } from '../libs/dom.js'

import initMobiusUI from './statics/js/mobius-css.js'
import {
  whenContentLoaded,
  initMobiusJS,
  initConsole
} from './libs/mobius.js'

whenContentLoaded(async () => {
  // 初始化 Mobius UI（引入 Houdini 等渐进增强）
  initMobiusUI()
  initConsole()

  await initMobiusJS({
    getConfigUrl: 'https://subdomain.example.com/path/to/get_config_url/',
    setConfigUrl: 'https://subdomain.example.com/path/to/set_config_url/',
    userPoolId: '************************',
    getThemeUrl: 'https://subdomain.example.com/path/to/get_theme_url/',
    setThemeUrl: 'https://subdomain.example.com/path/to/set_theme_url/',
    getAPITicketUrl: 'https://subdomain.example.com/path/to/get_api_ticket_url/',
    mpLoginUrl: 'https://subdomain.example.com/path/to/mp_login_url/',
    mpGetUserInfoUrl: 'https://subdomain.example.com/path/to/mp_get_user_info_url/',
    getWepayParamsUrl: 'https://subdomain.example.com/path/to/get_wepay_params_url/',
    getTradeStateUrl: 'https://subdomain.example.com/path/to/get_trade_state_url/'
  })

  // 启动应用
  run(main, {
    DOM: makeDOMDriver('#app')
  })
})
