import { mark } from './mark'
import { style, prefixClassWithMobius } from './style'
import { actuate } from './actuate'
import { html } from '../libs/lit-html'
import { view } from './view'

export const elementMakerUtilsContexts = {
  mark,
  style,
  prefix: prefixClassWithMobius,
  actuate,
  html,
  view
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
