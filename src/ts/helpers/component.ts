import {
  isPlainObject, isArray, isFunction,
  isVacuo, TERMINATOR,
  Mutation, Data,
  isData, isMutation,
  replayWithLatest, pipeAtom,
  mutationToDataS,
  combineLatestT
} from '../libs/mobius-utils'
import {
  nothing
} from '../libs/lit-html'
import { ELEMENT_MAKER_UTILS } from './element'
import { createUITache } from './ui-tache'
import { createUIDriver } from './ui-driver'

import type {
  Vacuo, Terminator,
  ReplayDataMediator, AtomLikeOfOutput
} from '../libs/mobius-utils'
import type { ElementMakerUtils } from './element'
import type { TemplateResult } from '../libs/lit-html'

// When `enableReplay` options is not specified, it will be handled as `true`
type ReturnTemplateResult<T extends StaticComponentOptions> =
  undefined extends T['enableReplay'] ? ReplayDataMediator<TemplateResult> :
    T['enableReplay'] extends true ? ReplayDataMediator<TemplateResult> : Data<TemplateResult>

/******************************************************************************************************
 *
 *                                           Static Component
 *
 ******************************************************************************************************/

/**
 *
 */
export interface StaticComponentOptions {
  enableReplay?: boolean
}
const DEFAULT_STATIC_COMPONENT_OPTIONS: Required<StaticComponentOptions> = {
  enableReplay: true
}

/**
 * @param template template can be set to anything, especially a function.
 *                   When set it to a function, the function is expected to be return the actually template.
 *                   And it will be called with `utils` as the first argument.
 * @param options.enableReplay When set to `true`, you will get a `ReplayDataMediator` as the return value,
 *                               instead of a `Data` when leave it `undefined` or set to `false`.
 * @return `ReplayDataMediator<TemplateResult>` | `Data<TemplateResult>`
 */
export function makeStaticComponent <Options extends StaticComponentOptions> (
  template: ((utils: ElementMakerUtils) => any), options?: Options
): ReturnTemplateResult<Options>
export function makeStaticComponent <Options extends StaticComponentOptions> (
  template: any, options?: Options
): ReturnTemplateResult<Options>
export function makeStaticComponent (
  template: any, options: StaticComponentOptions = DEFAULT_STATIC_COMPONENT_OPTIONS
): Data<TemplateResult> | ReplayDataMediator<TemplateResult> {
  if (!isPlainObject(options)) {
    throw (new TypeError('"options" is expected to be type of "PlainObject".'))
  }

  if (isData(template)) {
    // do nothing
  } else if (isMutation(template)) {
    template = mutationToDataS(replayWithLatest(1, template))
  } else if (isFunction(template)) {
    template = Data.of(template({ ...ELEMENT_MAKER_UTILS }))
  } else {
    template = Data.of(template)
  }

  const { enableReplay = true } = options

  if (enableReplay) {
    template = replayWithLatest(1, template)
  }

  return template
}

/******************************************************************************************************
 *
 *                                           Instant Component
 *
 ******************************************************************************************************/

/**
 *
 */
export interface InstantComponentOptions {
  enableReplay?: boolean
  /**
   * When set to true, the component will use `nothing` as default value in avoid of
   * stucking the whole application when sources are not ready.
   */
  enableOutlier?: boolean
}
const DEFAULT_INSTANT_COMPONENT_OPTIONS: Required<InstantComponentOptions> = {
  enableReplay: true,
  enableOutlier: true
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

export function makeInstantComponent <S extends Array<AtomLikeOfOutput<any>>, Options extends InstantComponentOptions> (
  sources: [...S], transformation: InstantComponentTransformation<ValuesOfAtomArray<[...S]>>, options?: Options
): ReturnTemplateResult<Options>
export function makeInstantComponent <S extends Record<string, AtomLikeOfOutput<any>>, Options extends InstantComponentOptions> (
  sources: S, transformation: InstantComponentTransformation<ValuesOfAtomRecord<S>>, options?: Options
): ReturnTemplateResult<Options>
export function makeInstantComponent <S extends AtomLikeOfOutput<any>, Options extends InstantComponentOptions> (
  sources: S, transformation: InstantComponentTransformation<ValueOfAtom<S>>, options?: Options
): ReturnTemplateResult<Options>
export function makeInstantComponent <S extends any, Options extends InstantComponentOptions> (
  sources: S, transformation: InstantComponentTransformation<S>, options?: Options
): ReturnTemplateResult<Options>
export function makeInstantComponent (
  sources: any, transformation: any, options: InstantComponentOptions = DEFAULT_INSTANT_COMPONENT_OPTIONS
): Data<TemplateResult> | ReplayDataMediator<TemplateResult> {
  if (!isPlainObject(options)) {
    throw (new TypeError('"options" is expected to be type of "PlainObject".'))
  }

  const { enableReplay, enableOutlier } = { ...DEFAULT_INSTANT_COMPONENT_OPTIONS, ...options }

  let inputD

  // NOTE: Array type of input is most frequent scene
  if (isArray<AtomLikeOfOutput<any>>(sources)) {
    inputD = combineLatestT(sources)
  } else if (isMutation(sources)) {
    inputD = mutationToDataS(replayWithLatest(1, sources))
  } else if (isData(sources)) {
    inputD = sources
  } else if (isPlainObject(sources)) {
    inputD = combineLatestT(sources)
  } else {
    // when `sources` is set to a normal static value, such as `string`, `number`, `boolean`
    //   always return ReplayDataMediator
    inputD = replayWithLatest(1, Data.of(sources))
  }

  const inputRD = replayWithLatest(1, inputD as any)

  const mutation = Mutation.ofLift((prev: any, template: any, mutation: any) => {
    if (isVacuo(prev)) return TERMINATOR
    return transformation(prev, template, mutation, { ...ELEMENT_MAKER_UTILS })
  })
  const stepOne = enableOutlier ? Data.of<TemplateResult>(nothing as TemplateResult) : Data.empty<TemplateResult>()
  const stepTwo = enableReplay ? replayWithLatest(1, stepOne) : stepOne

  pipeAtom(inputRD, mutation, stepTwo)

  return stepTwo
}

/******************************************************************************************************
 *
 *                                           Other Component
 *
 ******************************************************************************************************/

/**
 *
 */
export const makeTacheFormatComponent = createUITache
export const makeDriverFormatComponent = createUIDriver

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
