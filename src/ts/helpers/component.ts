import {
  isPlainObject, isArray, isNormalFunction,
  isVacuo, TERMINATOR,
  Mutation, Data,
  isDataLike, isMutationLike,
  replayWithLatest, pipeAtom,
  mutationToDataS,
  combineLatestT
} from '../libs/mobius-utils'
import {
  nothing
} from '../libs/lit-html'
import { ELEMENT_MAKER_UTILS } from './element'
import { createGUITache } from './gui-tache'
import { createGUIDriver } from './gui-driver'
import { DEFAULT_COMPONENT_COMMON_OPTIONS } from './component.common'

import type {
  Vacuo, Terminator,
  DataLike,
  ReplayDataMediator, AtomLikeOfOutput
} from '../libs/mobius-utils'
import type { ElementMakerUtils } from './element'
import type { TemplateResult } from '../libs/lit-html'
import type { ComponentCommonOptions } from './component.common'

/******************************************************************************************************
 *
 *                                           Static Component
 *
 ******************************************************************************************************/

/**
 *
 */
export interface StaticComponentOptions extends ComponentCommonOptions { }
const DEFAULT_STATIC_COMPONENT_OPTIONS: Required<StaticComponentOptions> = {
  ...DEFAULT_COMPONENT_COMMON_OPTIONS
}

/**
 * @param template template can be set to anything, especially a function.
 *                 When set it to a function, the function is expected to be return the actually template.
 *                 And it will be called with `utils` as the first argument.
 * @param options.enableAsync Whether the component is async.
 * @param options.enableReplay When set to `true`, you will get a `ReplayDataMediator` as the return value,
 *                             instead of a `Data` when leave it `undefined` or set to `false`.
 * @todo TODO: support async function, consume `options.enableOutlier`.
 */
export function makeStaticComponent (template: ((utils: ElementMakerUtils) => any)): ReplayDataMediator<TemplateResult>
export function makeStaticComponent (
  template: ((utils: ElementMakerUtils) => any), options?: StaticComponentOptions & { enableReplay?: true }
): ReplayDataMediator<TemplateResult>
export function makeStaticComponent (
  template: ((utils: ElementMakerUtils) => any), options?: StaticComponentOptions & { enableReplay?: false }
): Data<TemplateResult>
export function makeStaticComponent (template: any): ReplayDataMediator<TemplateResult>
export function makeStaticComponent (
  template: any, options?: StaticComponentOptions & { enableReplay?: true }
): ReplayDataMediator<TemplateResult>
export function makeStaticComponent (
  template: any, options?: StaticComponentOptions & { enableReplay?: false }
): Data<TemplateResult>
export function makeStaticComponent (
  template: any, options: StaticComponentOptions = DEFAULT_STATIC_COMPONENT_OPTIONS
): Data<TemplateResult> | ReplayDataMediator<TemplateResult> {
  if (!isPlainObject(options)) {
    throw (new TypeError('"options" is expected to be type of "PlainObject".'))
  }

  let preparedTemplate: DataLike<TemplateResult>

  if (isDataLike(template)) {
    preparedTemplate = template
  } else if (isMutationLike(template)) {
    preparedTemplate = mutationToDataS(replayWithLatest(1, template))
  } else if (isNormalFunction(template)) {
    preparedTemplate = Data.of(template({ ...ELEMENT_MAKER_UTILS }))
  } else {
    preparedTemplate = Data.of(template)
  }

  const preparedOptions = { ...DEFAULT_STATIC_COMPONENT_OPTIONS, ...options }
  const { enableAsync: isAsync, enableReplay } = preparedOptions

  if (enableReplay) {
    preparedTemplate = replayWithLatest(1, preparedTemplate)
  }

  preparedTemplate.setOptions('isAsync', isAsync)

  return preparedTemplate as (Data<TemplateResult> | ReplayDataMediator<TemplateResult>)
}

/******************************************************************************************************
 *
 *                                           Instant Component
 *
 ******************************************************************************************************/

/**
 *
 */
export interface InstantComponentOptions extends ComponentCommonOptions { }
const DEFAULT_INSTANT_COMPONENT_OPTIONS: Required<InstantComponentOptions> = {
  ...DEFAULT_COMPONENT_COMMON_OPTIONS
}

type CastAnyArray<T> = T extends any[] ? T : any[]

type ValueOfAtom<T> = T extends AtomLikeOfOutput<infer V> ? V : never
type ValuesOfAtomArray<T extends Array<AtomLikeOfOutput<any>>> = T extends [] ? [] :
  T extends [infer U, ...infer Rest] ?
      [ValueOfAtom<U>, ...ValuesOfAtomArray<CastAnyArray<Rest>>] : T
type ValuesOfAtomRecord<T extends Record<string, AtomLikeOfOutput<any>>> = {
  [K in keyof T]: ValueOfAtom<T[K]>
}

type InstantComponentTransformation<S> = (
  prev: S, template: TemplateResult | Vacuo, mutation: Mutation<S, TemplateResult | Terminator>, contexts: ElementMakerUtils
) => TemplateResult

// for array sources
export function makeInstantComponent <S extends Array<AtomLikeOfOutput<any>>> (
  sources: [...S], transformation: InstantComponentTransformation<ValuesOfAtomArray<[...S]>>
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends Array<AtomLikeOfOutput<any>>> (
  sources: [...S], transformation: InstantComponentTransformation<ValuesOfAtomArray<[...S]>>, options?: InstantComponentOptions & { enableReplay?: true }
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends Array<AtomLikeOfOutput<any>>> (
  sources: [...S], transformation: InstantComponentTransformation<ValuesOfAtomArray<[...S]>>, options?: InstantComponentOptions & { enableReplay?: false }
): Data<TemplateResult>
// for record sources
export function makeInstantComponent <S extends Record<string, AtomLikeOfOutput<any>>> (
  sources: S, transformation: InstantComponentTransformation<ValuesOfAtomRecord<S>>
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends Record<string, AtomLikeOfOutput<any>>> (
  sources: S, transformation: InstantComponentTransformation<ValuesOfAtomRecord<S>>, options?: InstantComponentOptions & { enableReplay?: true }
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends Record<string, AtomLikeOfOutput<any>>> (
  sources: S, transformation: InstantComponentTransformation<ValuesOfAtomRecord<S>>, options?: InstantComponentOptions & { enableReplay?: false }
): Data<TemplateResult>
// for atom sources
export function makeInstantComponent <S extends AtomLikeOfOutput<any>> (
  sources: S, transformation: InstantComponentTransformation<ValueOfAtom<S>>
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends AtomLikeOfOutput<any>> (
  sources: S, transformation: InstantComponentTransformation<ValueOfAtom<S>>, options?: InstantComponentOptions & { enableReplay?: true }
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends AtomLikeOfOutput<any>> (
  sources: S, transformation: InstantComponentTransformation<ValueOfAtom<S>>, options?: InstantComponentOptions & { enableReplay?: false }
): Data<TemplateResult>
// for any sources
export function makeInstantComponent <S extends any> (
  sources: S, transformation: InstantComponentTransformation<S>
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends any> (
  sources: S, transformation: InstantComponentTransformation<S>, options?: InstantComponentOptions & { enableReplay?: true }
): ReplayDataMediator<TemplateResult>
export function makeInstantComponent <S extends any> (
  sources: S, transformation: InstantComponentTransformation<S>, options?: InstantComponentOptions & { enableReplay?: false }
): Data<TemplateResult>
export function makeInstantComponent (
  sources: any, transformation: any, options: InstantComponentOptions = DEFAULT_INSTANT_COMPONENT_OPTIONS
): Data<TemplateResult> | ReplayDataMediator<TemplateResult> {
  if (!isPlainObject(options)) {
    throw (new TypeError('"options" is expected to be type of "PlainObject".'))
  }

  const preparedOptions = { ...DEFAULT_INSTANT_COMPONENT_OPTIONS, ...options }
  const { enableAsync: isAsync, enableReplay, enableOutlier } = preparedOptions

  let inputD: DataLike<any>
  // NOTE: Array type of input is most frequent scene
  if (isArray<AtomLikeOfOutput<any>>(sources)) {
    inputD = combineLatestT(sources)
  } else if (isMutationLike(sources)) {
    inputD = mutationToDataS(replayWithLatest(1, sources))
  } else if (isDataLike(sources)) {
    inputD = sources
  } else if (isPlainObject(sources)) {
    inputD = combineLatestT(sources)
  } else {
    // when `sources` is set to a normal static value, such as `string`, `number`, `boolean`
    //   always return ReplayDataMediator
    inputD = replayWithLatest(1, Data.of(sources))
  }
  const inputRD = replayWithLatest(1, inputD)

  inputRD.setOptions('isAsync', isAsync)

  const mutation = Mutation.ofLift((prev: any, template: TemplateResult | Terminator, mutation: any) => {
    if (isVacuo(prev)) return TERMINATOR
    return transformation(prev, template, mutation, { ...ELEMENT_MAKER_UTILS })
  }, { isAsync })

  let preparedTemplate: DataLike<TemplateResult>
  if (enableOutlier) {
    preparedTemplate = Data.of<TemplateResult>(nothing as unknown as TemplateResult, { isAsync })
  } else {
    preparedTemplate = Data.empty<TemplateResult>({ isAsync })
  }

  if (enableReplay) {
    preparedTemplate = replayWithLatest(1, preparedTemplate)
  }

  pipeAtom(inputRD, mutation, preparedTemplate)

  return preparedTemplate as (Data<TemplateResult> | ReplayDataMediator<TemplateResult>)
}

/******************************************************************************************************
 *
 *                                           Other Component
 *
 ******************************************************************************************************/

/**
 *
 */
export const makeTacheFormatComponent = createGUITache
export const makeDriverFormatComponent = createGUIDriver

/******************************************************************************************************
 *
 *                                          Instant Component Type Tests
 *
 ******************************************************************************************************/

// const c0 = makeInstantComponent(
//   [Data.of('cigaret'), Data.of('24')],
//   (prev, template, mutation, contexts) => {
//     const [name, age] = prev

//     return contexts.html``
//   }
// )
// const c1 = makeInstantComponent(
//   { name: Data.of('cigaret'), age: replayWithLatest(1, Data.of(24)) },
//   (prev, template, mutation, contexts) => {
//     const { name, age } = prev

//     return contexts.html``
//   }
// )
// const c2 = makeInstantComponent(
//   Data.of('cigaret'),
//   (prev, template, mutation, contexts) => {
//     const name = prev
//     return contexts.html``
//   }
// )
// const c3 = makeInstantComponent(
//   'cigaret',
//   (prev, template, mutation, contexts) => {
//     return contexts.html``
//   }
// )
