import './pages/index'
import './main.css'
import * as ThemeService from './services/theme.service'

document.addEventListener('DOMContentLoaded', () => {
  ThemeService.initTheme()
  const hoverSupported =
    getComputedStyle(document.body, '::before').content === 'none'
  console.info('hover_supported:', hoverSupported)
})
