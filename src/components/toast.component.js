import { div } from '../libs/dom.js'
import { makeMaskE } from '../elements/mask.element.js'
import { makeToastE } from '../elements/toast.element.js'
import { makeBaseComponent } from '../common/index.js'
import { map } from '../libs/rx.js'
import { asIs } from '../libs/mobius.js'

const makeToastVnode = ({ unique, children, config }) => {
  const { isShow = false, hideOnClick = false, hasMask = true, maskConfig } = config

  return div(`.js_${unique}`, {
    dataset: { unique, hideonclick: String(hideOnClick) },
    style: { display: isShow ? 'block' : 'none' }
  },
  [
    makeMaskE({
      selector: '.mobius-size--fullabs',
      config: { isShow: hasMask, ...maskConfig }
    }),
    div('.mobius-size--fullabs.mobius-layout__vertical.mobius-flex-justify--center.mobius-flex-items--center', [
      makeToastE({
        unique: unique,
        selector: '',
        children: [],
        props: {},
        config: { ...config }
      })
    ])
  ])
}

export const makeToastC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => source.DOM.select(`.js_${unique}`).events('click').pipe(
      map(e => {
        if (e.ownerTarget.dataset.hideonclick === undefined) return {}
        const hideOnClick = e.ownerTarget.dataset.hideonclick === 'true'
        return { isShow: !hideOnClick }
      })
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeToastVnode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeToastVnode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}
