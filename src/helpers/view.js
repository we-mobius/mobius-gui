import { isDirty, dirty, Marker, isMarker, isPlain } from './base.js'
import { html } from '../libs/lit-html.js'
import { mark } from './mark.js'
import { style } from './style.js'
import { actuate } from './actuate.js'

const preprocess = (strings, ...values) => {
  return [strings, ...values.map(value => {
    // if current is not a Marker, skip value transformation
    if (isMarker(value)) {
      // use Marker constructor to transform the Marker value of quoted string format
      //  -> "classname" -> { _value: "classname" }<Marker>
      return Marker.of(value)
    } else if (isPlain(value)) {
      return dirty(value.value)
    } else {
      return value
    }
  })]
}

const postprocess = (strings, ...values) => {
  return [strings, ...values.map(value => isDirty(value) ? value.value : value)]
}

/**
 * @param args [strings, ...values] which from template literals
 * @return TemplateResults
 */
export const view = ({ marks = {}, styles = {}, actuations = {}, configs = {} } = {}) => (...args) => {
  const preprocessed = preprocess(...args)
  const marked = mark(marks, configs)(...preprocessed)
  const styled = style(styles, configs)(...marked)
  const actuated = actuate(actuations, configs)(...styled)
  const postprocessed = postprocess(...actuated)
  const templateResults = html(...postprocessed)
  return templateResults
}
