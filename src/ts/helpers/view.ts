import { isDirty, Dirty, Marker, isValidMarker, isPlain } from './base'
import { mark } from './mark'
import { style } from './style'
import { actuate } from './actuate'
import { html } from '../libs/lit-html'

import type { TemplateResult } from '../libs/lit-html'

export interface TemplatePieces {
  strings: TemplateStringsArray
  values: any[]
}

/**
 * Processor for tagged template.
 */
const preprocess = (templatePieces: TemplatePieces): TemplatePieces => {
  const { strings, values } = templatePieces
  return {
    strings,
    values: values.map(value => {
      // if current is not a Marker, skip value transformation
      if (isValidMarker(value)) {
        // use Marker constructor to transform the Marker value of quoted string format
        //  -> "classname" -> { _value: "classname" }<Marker>
        return Marker.of(value)
      } else if (isPlain(value)) {
        return Dirty.of(value.value)
      } else {
        return value
      }
    })
  }
}

/**
 * Processor for tagged template. Is used to remove the marker from the values.
 */
const postprocess = (templatePieces: TemplatePieces): TemplatePieces => {
  const { strings, values } = templatePieces
  const newValues = values.map(value => isDirty(value) ? value.value : value)
  return {
    strings: strings,
    values: newValues
  }
}

export interface ViewOptions {
  marks?: Record<string, any>
  styles?: Record<string, any>
  actuations?: Record<string, any>
  configs?: Record<string, any>
}
/**
 * Usually used as a tag function for template literals.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals | Template literals}
 */
export type TemplateToTemplateResult = (strings: TemplateStringsArray, ...values: any[]) => TemplateResult
/**
 * Return a function will usually used as a tag function for template literals.
 */
export const view = (viewOptions: ViewOptions): TemplateToTemplateResult =>
  (strings: TemplateStringsArray, ...values: any[]): TemplateResult => {
    const { marks = {}, styles = {}, actuations = {}, configs = {} } = viewOptions
    const templatePieces = { strings, values }
    const preprocessed = preprocess(templatePieces)
    const marked = mark(marks, configs)(preprocessed)
    const styled = style(styles, configs)(marked)
    const actuated = actuate(actuations, configs)(styled)
    const postprocessed = postprocess(actuated)
    const templateResult = html(postprocessed.strings, ...postprocessed.values)
    return templateResult
  }
