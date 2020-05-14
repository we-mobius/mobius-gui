import './pages/index'
import initMobiusUI from './statics/js/mobius-ui'
import './main.css'
// import * as ThemeService from './services/theme.service'

document.addEventListener('DOMContentLoaded', () => {
  // ThemeService.initTheme()
  initMobiusUI()
  const hoverSupported =
    getComputedStyle(document.body, '::before').content === 'none'
  console.info('hover_supported:', hoverSupported)
})
