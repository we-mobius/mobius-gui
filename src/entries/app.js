import '../pages/index'
import * as ThemeService from '../services/theme.service'

document.addEventListener('DOMContentLoaded', () => {
  ThemeService.initTheme()
  const hoverSupported =
    getComputedStyle(document.body, '::before').content === 'none'
  console.info('hover_supported:', hoverSupported)
})
