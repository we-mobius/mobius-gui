export default function initMobiusUI () {
  const customProps = {
    color: ['--start-color', '--end-color']
  }
  if (window.CSS) {
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
