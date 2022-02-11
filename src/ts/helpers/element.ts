import { Dirty, Marker, Plain } from './base'
import { mark } from './mark'
import { style, prefixClassWithMobius } from './style'
import { actuate } from './actuate'
import { html, ref } from '../libs/lit-html'
import { view } from './view'

import type { AnyFunction } from '../libs/mobius-utils'
import type { ViewOptions, TemplateToTemplateResult } from './view'
import type { TemplateResult } from '../libs/lit-html'

export const ELEMENT_MAKER_UTILS = {
  mark,
  style,
  prefix: prefixClassWithMobius,
  actuate,
  html,
  ref,
  view,
  dirty: Dirty.of,
  marker: Marker.of,
  plain: Plain.of
} as const

export type ElementMakerUtils = typeof ELEMENT_MAKER_UTILS

/**
 * `MergeOptions` is only desigend to merge the incoming options with the default ViewOptions,
 *   the ViewOptions is defined as an interface that not extends the Record<string, any>,
 *   so the `keyof A` exactly works as `keyof ViewOptions` do the great job
 *   other cases are not guaranteed to work.
 */
type MergeOptions<A, B extends Partial<A>> = {
  [K in keyof A]: K extends keyof B ? Required<B[K] & A[K]> : A[K]
}
type ChildrenRequired<T> = {
  [P in keyof T]-?: T[P] extends (Record<string, any> | undefined) ? Required<T[P]> : T[P]
}

// Why define the `Functionable` but not use? For readable type hints
type Functionable<T, Configs> = T | ((configs: Configs) => T)
type StaticFunctionable<T, Configs> = {
  [P in keyof T]: NonNullable<T[P]> | ((configs: Configs) => NonNullable<T[P]>)
}
type FlexFunctionable<T, Configs> = {
  [P in keyof T]: T[P] extends (AnyFunction | undefined) ? (
    NonNullable<T[P]> extends ((event: infer F, ...rest: infer _) => infer R) ?
        ((event: F, configs: Configs) => R) : never
  ) : (
    NonNullable<T[P]> | ((configs: Configs) => NonNullable<T[P]>)
  )
}
export type HyperElementOptions<Options extends ElementOptions, Configs = Required<NonNullable<Options['configs']>>> = {
  [P in keyof Options]: P extends 'marks' | 'styles' ? (
    StaticFunctionable<Options[P], Configs>
  ) : P extends 'actuations' ? (
    FlexFunctionable<Options[P], Configs>
  ) : Options[P]
}

/**
 * Base options for all elements, extends the `ViewOptions`.
 *
 * All custom elements should define their own options by extending this interface.
 */
export interface ElementOptions extends ViewOptions { }

interface ElementTemplatePrepareContexts extends ViewOptions {
  utils: ElementMakerUtils
}

/**
 * Options for `createElementMaker`.
 *
 * @see {@link createElementMaker}
 */
interface ElementMakerCreateOptions<Options extends ElementOptions>
  extends MergeOptions<ChildrenRequired<ViewOptions>, HyperElementOptions<Options>> {
  /**
   * @param view A function will usually used as tag function for template literals.
   * @param contexts Collection of second hand element options and a set of useful utilities for element preparation.
   * @return TemplateResult which can pass to lit-html's `render` like function to render the element.
   *
   * @see {@link view}
   */
  prepareTemplate: (view: TemplateToTemplateResult, contexts: ChildrenRequired<Options> & ElementTemplatePrepareContexts) => TemplateResult
}

/**
 * @typeParam Options - Custom element's options.
 */
export type ElementMaker<Options extends ElementOptions = ElementOptions> =
  (options: HyperElementOptions<Options>) => TemplateResult

/**
 * Creates a new element maker.
 *
 * An element maker is just a function which takes a set of options and returns a template result.
 *
 * It is suggested to specify a default value for each of declared options.
 */
export const createElementMaker = <Options extends ElementOptions = ElementOptions>(
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
    const { marks = {}, styles = {}, actuations = {}, configs = {} } = options

    const preparedMarks: ChildrenRequired<Options>['marks'] = { ...elementDefaultMarks, ...marks } as any
    const preparedStyles: ChildrenRequired<Options>['styles'] = { ...elementDefaultStyles, ...styles } as any
    const preparedActuations: ChildrenRequired<Options>['actuations'] = { ...elementDefaultActuations, ...actuations } as any
    const preparedConfigs: ChildrenRequired<Options>['configs'] = { ...elementDefaultConfigs, ...configs } as any

    const contexts: ChildrenRequired<Options> & ElementTemplatePrepareContexts = {
      marks: preparedMarks,
      styles: preparedStyles,
      actuations: preparedActuations,
      configs: preparedConfigs,
      utils: { ...ELEMENT_MAKER_UTILS }
    } as any

    return prepareTemplate(
      view({ marks: preparedMarks, styles: preparedStyles, actuations: preparedActuations, configs: preparedConfigs }), contexts
    )
  }
}
