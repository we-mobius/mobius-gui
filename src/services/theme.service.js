const THEMES = ['light', 'dark']
const DEFAULT_THEME = THEMES[0]
const MODES = ['light', 'dark']

let currentTheme = ''
let currentMode = ''

function setThemeTo (theme) {
  currentTheme = theme
  document.documentElement.setAttribute('data-theme', currentTheme)
}

function initTheme () {
  // 优先级： CSS > DOM > DEFAULT
  const cssTheme = getComputedStyle(document.documentElement)
    .getPropertyValue('--mode').replace(/["' ]/g, '')
  if (THEMES.includes(cssTheme)) {
    console.info(`从 CSS 中获取主题：${cssTheme}`)
    setThemeTo(cssTheme)
    if (MODES.includes(cssTheme)) {
      currentMode = cssTheme
    }
  } else {
    const domTheme = document.documentElement.dataset.theme
    if (THEMES.includes(domTheme)) {
      console.info(`从 DOM 中获取主题：${domTheme}`)
      setThemeTo(domTheme)
    } else {
      console.info(`设置为默认主题：${DEFAULT_THEME}`)
      setThemeTo(DEFAULT_THEME)
    }
  }

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMediaQuery.addListener(e => {
    const darkModeOn = e.matches
    currentMode = darkModeOn ? 'dark' : 'light'
    console.log(
      `检测到您的设备切换为：${
        darkModeOn ? 'Dark Mode' : 'Light Mode'
      }，是否切换为推荐主题？`
    )
    setThemeTo(currentMode)
    console.log('已经为您自动切换！')
  })
}

export { initTheme }
