import { makeMonacoEditorE } from '../elements/editor-monaco.element.js'
import { makeBaseComponent } from '../common/component.common.js'
import { map, merge } from '../libs/rx.js'
import { asIs } from '../libs/mobius-utils.js'

const makeVNode = ({ unique, children, config }) => {
  return makeMonacoEditorE({
    unique: unique,
    selector: '',
    children: children,
    props: {},
    config: { ...config }
  })
}

export const makeMonacoEditorC = ({ unique, children, componentToDriverMapper = asIs, driver, driverToComponentMapper = asIs, config }) => {
  return makeBaseComponent({
    children: children,
    intent: source => {
      const buildIntent = eventType => source.DOM.select(`.js_${unique} .js_${unique}__event-proxy`)
        .events(eventType, undefined, false)
        .pipe(
          map(e => e.detail),
          map(componentToDriverMapper)
        )
      return {
        ready: buildIntent('ready'),
        instantialized: buildIntent('instantialized'),
        load: buildIntent('load')
      }
    },
    model: intent$s => {
      // TODO: avoid creating multiple driver output observables
      return driver(merge(...Object.values(intent$s)))
    },
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}
