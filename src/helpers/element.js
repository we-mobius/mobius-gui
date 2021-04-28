import { view } from './view.js'
import { mark } from './mark.js'
import { style, prefixClassWithMobius } from './style.js'
import { actuate } from './actuate.js'

export const elementMakerUtilsContexts = {
  view,
  mark,
  style,
  prefix: prefixClassWithMobius,
  actuate
}

/**
 * @param marks Object
 * @param styles Object
 * @param actuation Object
 * @param handler Function which takes view template function as first argument,
 *                takes contexts<object>({ marks, styles, actuations, configs, utils }) as 2nd argument,
 *                then returns a TemplateResult.
 * @return ElementMaker
 */
export const makeElementMaker = ({ marks = {}, styles = {}, actuations = {}, configs = {}, handler }) => {
  return ({ marks: _marks = {}, styles: _styles = {}, actuations: _actuations = {}, configs: _configs = {} } = {}) => {
    _marks = { ...marks, ..._marks }
    _styles = { ...styles, ..._styles }
    _actuations = { ...actuations, ..._actuations }
    _configs = { ...configs, ..._configs }

    return handler(
      view({
        marks: _marks, styles: _styles, actuations: _actuations, configs: _configs
      }),
      {
        marks: _marks,
        styles: _styles,
        actuations: _actuations,
        configs: _configs,
        utils: { ...elementMakerUtilsContexts }
      }
    )
  }
}
