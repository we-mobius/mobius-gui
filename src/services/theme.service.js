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

const lightsource = {
  lt2rb: false, rt2lb: false, rb2lt: false, lb2rt: false
}

const Light = {
  list: [],
  listen: function (fn) {
    this.list.push(fn)
  },
  publish: function () {
    this.list.forEach(fn => {
      fn.apply(this, arguments)
    })
  }
}

function setLightsource (dir) {
  if (lightsource[dir] === true) { return false }
  Object.keys(lightsource).forEach(key => {
    lightsource[key] = false
  })
  lightsource[dir] = true
  document.documentElement.setAttribute('data-source', dir.substr(0, 2))
  Light.publish(lightsource)
  return true
}

export { initTheme, setThemeTo, setLightsource, Light }
