import { div, span } from '@cycle/dom'
import { map } from 'rxjs/operators'

function _destructDataset (dataset) {
  return Object.entries(dataset).reduce((pre, cur) => {
    pre[`data-${cur[0]}`] = cur[1]
    return pre
  }, {})
}
const _commonClass = '.js_mobius-button' +
   '.mobius-width--3rem.mobius-height--3rem.mobius-margin--xs.mobius-rounded--xs' +
   '.hover_mobius-bg--convex.cursor-pointer.flex.items-center.justify-center'
const _normalBtnClass = '.mobius-shadow--normal.hover_mobius-text--primary'
const _selectedBtnClass = '.mobius-shadow--inset.mobius-text--primary'

function _makeClickButtonVNode (unique, { name, iconname, dataset }, { selected }) {
  return div(
    `.js_${unique}${_commonClass}${selected === name ? _selectedBtnClass : _normalBtnClass}`,
    {
      attrs: {
        ..._destructDataset(dataset)
      }
    },
    [span(`.mobius-icon${iconname ? '.mobius-icon-' + iconname : ''}.mobius-text--2xl`)]
  )
}

// FIXME: 以 option 对象的方式传参，同时对该参数的个别字段使用闭包的特性是否会导致无意义的内存占用？
function makeClickButton ({ unique, attrs, driverInputMapper, driver, driverOutputMapper }) {
  return (source) => {
    const clickEvent$ = source.DOM.select('.js_mobius-button').events('click').pipe(
      map(driverInputMapper)
    )

    const vnode$ = driver(clickEvent$).pipe(
      map(driverOutputMapper),
      map((clickButtonConfig) => {
        return _makeClickButtonVNode(unique, attrs, clickButtonConfig)
      })
    )

    return {
      DOM: vnode$
    }
  }
}

export {
  makeClickButton
}
