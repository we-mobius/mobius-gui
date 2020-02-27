import "../pages/index";

const THEMES = ["light", "dark"];
const DEFAULT_THEME = THEMES[0];
const MODES = ["light", "dark"];

let current_theme = "";
let current_mode = "";

function setThemeTo(theme) {
  current_theme = theme;
  document.documentElement.setAttribute("data-theme", current_theme)
}

function initTheme() {
  // 优先级： CSS > DOM > DEFAULT
  let css_theme = getComputedStyle(document.documentElement).getPropertyValue("--mode").replace(/["' ]/g, "");
  if (THEMES.includes(css_theme)) {
    console.info(`从 CSS 中获取主题：${css_theme}`)
    setThemeTo(css_theme)
    if(MODES.includes(css_theme)) {
      current_mode = css_theme;
    }
  } else {
    let dom_theme = document.documentElement.dataset.theme;
    if (THEMES.includes(dom_theme)) {
      console.info(`从 DOM 中获取主题：${dom_theme}`)
      setThemeTo(dom_theme)
    } else {
      console.info(`设置为默认主题：${DEFAULT_THEME}`)
      setThemeTo(DEFAULT_THEME)
    }
  }

  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addListener((e) => {
    const darkModeOn = e.matches;
    current_mode = darkModeOn ? "dark" : "light";
    console.log(`检测到您的设备切换为：${darkModeOn ? "Dark Mode" : "Light Mode"}，是否切换为推荐主题？`);
    setThemeTo(current_mode)
    console.log(`已经为您自动切换！`)
  });
}

window.onload = () => {

  initTheme()

  let hover_supported = getComputedStyle(document.body, "::before").content === "none";
  console.info("hover_supported:", hover_supported)

}
