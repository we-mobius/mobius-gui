function initMobiusCSS () {
  const customProps = {
    color: ['--start-color', '--end-color']
  }
  console.log(`[MobiusCSS] initMobiusUI: window.CSS -> ${window.CSS}`)
  if (window.CSS && CSS.registerProperty) {
    console.log('[MobiusCSS] initMobiusUI: window.CSS methods...')
    console.dir(window.CSS)
    Object.keys(customProps).forEach(key => {
      if (customProps[key]) {
        customProps[key].forEach(prop => {
          CSS.registerProperty({
            name: prop,
            syntax: '<' + key + '>',
            inherits: false,
            initialValue: 'transparent'
          })
        })
      }
    })
  }
}

export { initMobiusCSS }
