import { mark } from './mark'
import { style, prefixClassWithMobius } from './style'
import { actuate } from './actuate'
import { html } from '../libs/lit-html'
import { view } from './view'

import type { ViewOptions, TemplateToTemplateResult } from './view'
import type { TemplateResult } from '../libs/lit-html'

export const ELEMENT_MAKER_UTILS = {
  mark,
  style,
  prefix: prefixClassWithMobius,
  actuate,
  html,
  view
} as const

export type ElementMakerUtils = typeof ELEMENT_MAKER_UTILS
interface ElementMakeContexts extends ViewOptions {
  utils: ElementMakerUtils
}

/**
 * `MergeOptions` is only desigend to merge the incoming options with the default ViewOptions,
 *   the ViewOptions is defined as an interface that not extends the Record<string, any>,
 *   so the `keyof A` exactly works as `keyof ViewOptions` do the great job
 *   other cases are not guaranteed to work.
 */
type MergeOptions<A, B extends Partial<A>> = {
  [K in keyof A]: K extends keyof A ? RecursiveRequired<B[K] & A[K]> : A[K]
}
type RecursiveRequired<T> = {
  [P in keyof T]-?: T[P] extends (Record<string, any> | undefined) ? RecursiveRequired<T[P]> :
    T[P];
}
/**
 * Options for `createElementMaker`.
 *
 * @see {@link createElementMaker}
 */
interface ElementMakerCreateOptions<Options extends Record<string, any>> extends MergeOptions<Required<ViewOptions>, Options> {
  /**
   * @param view A function will usually used as tag function for template literals.
   * @param contexts Collection of second hand element options and a set of useful utilities for element preparation.
   * @return TemplateResult which can pass to lit-html's `render` like function to render the element.
   *
   * @see {@link view}
   */
  prepareTemplate: (view: TemplateToTemplateResult, contexts: RecursiveRequired<Options> & ElementMakeContexts) => TemplateResult
}

/**
 * Default options type of ElementMaker.
 *
 * @see {@link ElementMaker}
 */
export interface ElementMakerOptions extends ViewOptions { }

/**
 * @typeParam Options Custom element options.
 */
export type ElementMaker<Options extends ElementMakerOptions = ElementMakerOptions> =
  (options: Options & ElementMakerOptions) => TemplateResult

/**
 * Creates a new element maker.
 *
 * An element maker is just a function which takes a set of options and returns a template result.
 *
 * It is suggested to specify a default value for each of declared options.
 */
export const createElementMaker = <Options extends ElementMakerOptions = ElementMakerOptions>(
  options: ElementMakerCreateOptions<Options>
): ElementMaker<Options> => {
  const {
    marks: elementDefaultMarks = {},
    styles: elementDefaultStyles = {},
    actuations: elementDefaultActuations = {},
    configs: elementDefaultConfigs = {},
    prepareTemplate
  } = options

  return (options) => {
    let { marks = {}, styles = {}, actuations = {}, configs = {} } = options

    marks = { ...elementDefaultMarks, ...marks }
    styles = { ...elementDefaultStyles, ...styles }
    actuations = { ...elementDefaultActuations, ...actuations }
    configs = { ...elementDefaultConfigs, ...configs }

    const contexts = {
      marks,
      styles,
      actuations,
      configs,
      utils: { ...ELEMENT_MAKER_UTILS }
    } as unknown as (RecursiveRequired<Options> & ElementMakeContexts)

    return prepareTemplate(
      view({ marks, styles, actuations, configs }), contexts
    )
  }
}
