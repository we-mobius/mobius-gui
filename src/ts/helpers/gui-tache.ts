import {
  isPlainObject, isArray,
  getPropByPath,
  looseCurryN,
  Data, Mutation, isAtomLike, isVacuo, TERMINATOR, isData, isMutation,
  replayWithLatest, mutationToDataS,
  pipeAtom, binaryTweenPipeAtom,
  combineLatestT, emptyStartWithT_, pluckT_, defaultToT_, nilToVoidT, asIsDistinctPreviousT, combineT,
  createGeneralTache_, useGeneralTache, useGeneralTache_
} from '../libs/mobius-utils'
import { ELEMENT_MAKER_UTILS } from './element'

import type { ElementMakerUtils } from './element'
import type {
  AnyStringRecord,
  PropPath, Terminator, ReplayDataMediator,
  AtomLike, AtomLikeOfOutput,
  SSTache, Tache,
  TacheOptions, TacheLevelContexts,
  GeneralTacheCreateOptions
} from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'

export type IUseGUITache = typeof useGeneralTache
export type { IUseGeneralTache_ as IUseGUITache_, IPartialUseGeneralTache_ as IPartialUseGUITache_ } from '../libs/mobius-utils'

type ValueOrAny<Target extends AnyStringRecord, K> = K extends keyof Target ? Target[K] : any

/******************************************************************************************************
 *
 *                                          Auxiliary functions
 *
 ******************************************************************************************************/

/**
 * Unidirectional source can only be used to pass GUI Tache data from outside to inside.
 *
 * @description_i18n 单向数据源只能够用于从 Tache 外部向 Tache 内部传递数据，不支持从 Tache 内部向外部传递数据。
 */
export const prepareUnidirGUITacheSource = (
  source: Data<AnyStringRecord> | AnyStringRecord): ReplayDataMediator<any> => {
  if (isData(source)) {
    return replayWithLatest(1, source)
  } else if (isPlainObject(source)) {
    const rawOption = Object.entries(source).reduce<AnyStringRecord>((acc, [key, value]) => {
      acc[key] = isData(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
      return acc
    }, {})

    return replayWithLatest(1, combineLatestT(rawOption))
  } else {
    throw (new TypeError('"source" is expected to be type of "Data" | "PlainObject".'))
  }
}

/**
 * Bidirectional source can be used to pass GUI Tache data from inside to outside and vice versa.
 *
 * @description_i18n 双向数据源既可以用于从 Tache 外部向 Tache 内部传递数据，也支持外部通过该数据源获取 Tache 内部的数据。
 */
export const prepareBidirGUITacheSource = (
  source: Record<string, Data<any> | ReplayDataMediator<any>>
): Record<string, ReplayDataMediator<any>> => {
  const rawOption = Object.entries(source).reduce<Record<string, ReplayDataMediator<any>>>((acc, [key, value]) => {
    acc[key] = isData(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
    return acc
  }, {})
  return rawOption
}

interface UnidirGUITacheSourceUseOptions {
  nilToVoid?: boolean
  isDistinct?: boolean
  isReplay?: boolean
}
const DEFAULT_UNIDIR_GUI_TACHE_SOURCE_USE_OPTIONS: Required<UnidirGUITacheSourceUseOptions> = {
  nilToVoid: true,
  isDistinct: true,
  isReplay: true
}
export const useUnidirGUITacheSource = <
  Target extends AnyStringRecord = AnyStringRecord, K extends string = ''
>(
    source: AtomLikeOfOutput<ValueOrAny<Target, K>>,
    key: PropPath,
    defaultValue: ValueOrAny<Target, K>,
    options: UnidirGUITacheSourceUseOptions = DEFAULT_UNIDIR_GUI_TACHE_SOURCE_USE_OPTIONS
  ): AtomLikeOfOutput<ValueOrAny<Target, K>> => {
  if (!isAtomLike(source)) {
    throw (new TypeError('"source" is expected to be type of "AtomLike".'))
  }

  const {
    nilToVoid, isDistinct, isReplay
  } = { ...DEFAULT_UNIDIR_GUI_TACHE_SOURCE_USE_OPTIONS, ...options }

  const taches: Array<SSTache<any, ValueOrAny<Target, K>>> = [pluckT_(key)]
  if (nilToVoid) {
    taches.push(nilToVoidT)
  }
  taches.push(defaultToT_(defaultValue))
  if (isDistinct) {
    taches.push(asIsDistinctPreviousT)
  }
  if (isReplay) {
    taches.push(replayWithLatest(1))
  }

  // ensure res have the latest value when optionD is repalyable
  const tempD = Data.empty<ValueOrAny<Target, K>>()
  // @ts-expect-error pass args through
  const res = tempD.pipe(...taches)

  binaryTweenPipeAtom(source, tempD)

  return res
}

type IPartialUseUnidirGUITacheSource_<
  Target extends AnyStringRecord = AnyStringRecord, K extends string = ''
> = (
  key: PropPath,
  defaultValue: ValueOrAny<Target, K>,
  options?: UnidirGUITacheSourceUseOptions
) => AtomLikeOfOutput<ValueOrAny<Target, K>>
type IUseUnidirGUITacheSource_<
  Target extends AnyStringRecord = AnyStringRecord, K extends string = ''
> = (
  source: AtomLikeOfOutput<ValueOrAny<Target, K>>
) => IPartialUseUnidirGUITacheSource_<Target, K>
/**
 * @see {@link useUnidirGUITacheSource}
 */
export const useUnidirGUITacheSource_: IUseUnidirGUITacheSource_ = looseCurryN(3, useUnidirGUITacheSource)
type IPartialTypedUseUnidirGUITacheSource_<Target extends AnyStringRecord> = <
  K extends string = ''
>(
  key: PropPath,
  defaultValue: ValueOrAny<Target, K>,
  options?: UnidirGUITacheSourceUseOptions
) => AtomLikeOfOutput<ValueOrAny<Target, K>>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BidirGUITacheSourceUseOptions {}
const DEFAULT_BIDIR_GUI_TACHE_SOURCE_USE_OPTIONS: Required<BidirGUITacheSourceUseOptions> = {}

export const useBidirGUITacheSource = <Target extends AnyStringRecord = AnyStringRecord, K extends string = ''>(
  source: Record<string, ReplayDataMediator<any>>,
  key: PropPath,
  defaultValue: ValueOrAny<Target, K>,
  options: BidirGUITacheSourceUseOptions = DEFAULT_BIDIR_GUI_TACHE_SOURCE_USE_OPTIONS
): AtomLikeOfOutput<ValueOrAny<Target, K>> => {
  if (!isPlainObject(source)) {
    throw (new TypeError('"source" is expected to be type of "PlainObject".'))
  }
  const atom = getPropByPath(key, source) ?? (isAtomLike(defaultValue) ? defaultValue : Data.of(defaultValue))
  return replayWithLatest(1, atom)
}

type IPartialUseBidirGUITacheSource_<Target extends AnyStringRecord = AnyStringRecord, K extends string = ''> = (
  key: PropPath,
  defaultValue: ValueOrAny<Target, K>,
  options?: BidirGUITacheSourceUseOptions
) => AtomLikeOfOutput<ValueOrAny<Target, K>>
type IUseBidirGUITacheSource_<Target extends AnyStringRecord = AnyStringRecord, K extends string = ''> = (
  source: Record<string, ReplayDataMediator<any>>
) => IPartialUseBidirGUITacheSource_<Target, K>
/**
 * @see {@link useBidirGUITacheSource}
 */
export const useBidirGUITacheSource_: IUseBidirGUITacheSource_ = looseCurryN(3, useBidirGUITacheSource)
type IPartialTypedUseBidirGUITacheSource_<Target extends AnyStringRecord> = <
  K extends string = ''
>(
  key: PropPath,
  defaultValue: ValueOrAny<Target, K>,
  options?: UnidirGUITacheSourceUseOptions
) => AtomLikeOfOutput<ValueOrAny<Target, K>>

/**
 *
 */
function formatGUITacheContexts <V> (contexts: Data<V> | ReplayDataMediator<V>): ReplayDataMediator<V>
function formatGUITacheContexts (contexts: any): ReplayDataMediator<any>
function formatGUITacheContexts (contexts: any): ReplayDataMediator<any> {
  let preparedContexts: Data<any> | ReplayDataMediator<any>
  if (isData(contexts)) {
    preparedContexts = contexts
  } else if (isMutation(contexts)) {
    preparedContexts = mutationToDataS(contexts)
  } else if (isPlainObject(contexts) || isArray(contexts)) {
    preparedContexts = combineLatestT(contexts)
  } else {
    preparedContexts = Data.of(contexts)
  }
  return replayWithLatest(1, preparedContexts)
}

/******************************************************************************************************
 *
 *                                          Main Types
 *
 ******************************************************************************************************/

/**
 *
 */
export interface GUITacheOptions extends TacheOptions {
  /**
   * Whether the generated Atom is relayable (for one).
   */
  enableReplay?: boolean
}
const DEFAULT_GUI_TACHE_OPTIONS: Required<GUITacheOptions> = {
  enableReplay: true
}
export interface GUITacheLevelContexts extends TacheLevelContexts {}
export interface GUITacheSingletonLevelContexts extends AnyStringRecord {}
export interface GUITacheSources {
  marks?: AnyStringRecord
  styles?: AnyStringRecord
  actuations?: AnyStringRecord
  configs?: AnyStringRecord
  outputs?: AnyStringRecord
}
type MergeDefault<A, B extends Partial<A>> = {
  // -? is unnecessary, A is always expected to be a Required<SomeType>
  [K in keyof A]-?: K extends keyof B ? B[K] : A[K]
}
type MapRecordValuesToReplayDataMediator<T> = {
  [P in keyof T]-?: T[P] extends AtomLike ? T[P] : ReplayDataMediator<T[P]>
}
type AtomizeGUITacheSources<T> = {
  [P in keyof T]-?: P extends 'marks' | 'styles' | 'actuations' | 'configs' ?
      (
        T[P] extends AtomLike ? T[P] : ReplayDataMediator<T[P]>
      ) : (
        P extends 'outputs' ? MapRecordValuesToReplayDataMediator<T[P]> : T[P]
      )
}
type PrepareGUITacheSources<S extends GUITacheSources>
  = AtomizeGUITacheSources<MergeDefault<Required<GUITacheSources>, S>>

type MapRecordValuesToOutputAtom<T> = {
  [P in keyof T]-?: T[P] extends AtomLike ? T[P] : AtomLikeOfOutput<T[P]>
}

export interface GUITacheCreateOptions<
  O extends GUITacheOptions = GUITacheOptions, TLC extends GUITacheLevelContexts = GUITacheLevelContexts,
  TSLC extends GUITacheSingletonLevelContexts = GUITacheSingletonLevelContexts,
  S extends GUITacheSources = GUITacheSources, Out = TemplateResult
> {
  prepareOptions?: (options: O) => O
  prepareTacheLevelContexts?: () => TLC
  prepareSingletonLevelContexts?: (
    sources: PrepareGUITacheSources<S>,
    contexts: {
      useMarks: IPartialTypedUseUnidirGUITacheSource_<NonNullable<S['marks']>>
      useStyles: IPartialTypedUseUnidirGUITacheSource_<NonNullable<S['styles']>>
      useActuations: IPartialTypedUseUnidirGUITacheSource_<NonNullable<S['actuations']>>
      useConfigs: IPartialTypedUseUnidirGUITacheSource_<NonNullable<S['configs']>>
      useOutputs: IPartialTypedUseBidirGUITacheSource_<NonNullable<S['outputs']>>
      tacheOptions: O
      tacheLevelContexts: TLC
    }
  ) => MapRecordValuesToOutputAtom<TSLC>
  prepareTemplate: (
    templateOptions: MergeDefault<Required<GUITacheSources>, S> & { singletonLevelContexts: TSLC },
    prevTemplate: Out,
    mutation: Mutation<AnyStringRecord, Out>,
    contexts: ElementMakerUtils & { tacheOptions: O }
  ) => Out
}
const DEFAULT_GUI_TACHE_CREATE_OPTIONS: Required<GUITacheCreateOptions<any, any, any, any, any>> = {
  prepareOptions: (options: GUITacheOptions) => ({ ...DEFAULT_GUI_TACHE_OPTIONS, ...options }),
  prepareTacheLevelContexts: () => ({ }),
  prepareSingletonLevelContexts: () => ({ }),
  prepareTemplate: () => 'function prepareTemplate is not defined!'
}

/******************************************************************************************************
 *
 *                                          Main Function
 *
 ******************************************************************************************************/

/**
 * 调用之后返回一个 partial applied function，称其为 tacheMaker
 *   -> tacheMaker 是一个函数，该函数接受 tacheOptions 参数用于调整 tache 的行为
 *   -> tacheMaker 使用之后返回一个函数，该函数即是 tache
 *     -> tache 函数接受一组输入，然后返回一组输出，输出通常是 `Data<TemplateResult>`
 *
 * @see {@link useGUITache_}
 */
export const createGUITache = <
  O extends GUITacheOptions = GUITacheOptions, TLC extends TacheLevelContexts = GUITacheLevelContexts,
  TSLC extends GUITacheSingletonLevelContexts = GUITacheSingletonLevelContexts,
  S extends GUITacheSources = GUITacheSources, Out = TemplateResult
>(
    createOptions: GUITacheCreateOptions<O, TLC, TSLC, S, Out>
  ): (
    (options?: O) => Tache<[S], Data<Out> | ReplayDataMediator<Out>>
  ) => {
  const preparedCreateOptions: Required<GUITacheCreateOptions<O, TLC, TSLC, S, Out>> = {
    ...DEFAULT_GUI_TACHE_CREATE_OPTIONS as any, ...createOptions
  }
  const {
    prepareOptions,
    prepareTacheLevelContexts,
    prepareSingletonLevelContexts,
    prepareTemplate
  } = preparedCreateOptions

  interface GUITacheInput {
    [key: string]: any
    marks: ReplayDataMediator<any>
    styles: ReplayDataMediator<any>
    actuations: ReplayDataMediator<any>
    configs: ReplayDataMediator<any>
    outputs: ReplayDataMediator<any>
    singletonLevelContexts: ReplayDataMediator<any>
  }
  type GUITacheMidpiece<P = any, C = any> = Mutation<P, C>
  type GUITacheOutput<Out = TemplateResult> = Data<Out> | ReplayDataMediator<Out>

  const uiTacheCreateOptions: GeneralTacheCreateOptions<
  O, TLC,
  [S],
  GUITacheInput,
  GUITacheMidpiece<any, Out>,
  GUITacheOutput<Out>
  > = {
    prepareOptions: (options) => {
      return prepareOptions(options)
    },
    prepareTacheLevelContexts: () => {
      // create component level contexts
      // scope to all of the same type of component instance
      const tacheLevelContexts = prepareTacheLevelContexts()
      return tacheLevelContexts
    },
    prepareInput: (options, tacheLevelContexts, sources) => {
      const {
        marks = replayWithLatest(1, Data.of({})),
        styles = replayWithLatest(1, Data.of({})),
        actuations = replayWithLatest(1, Data.of({})),
        configs = replayWithLatest(1, Data.of({})),
        outputs = {}
      } = sources[0]

      // process options
      // TODO: type inference doesn't work without explicitly specifying the type variables
      const preparedMarks = prepareUnidirGUITacheSource(marks).pipe<Data<AnyStringRecord>, ReplayDataMediator<AnyStringRecord>>(
        emptyStartWithT_({}), replayWithLatest(1)
      )
      const preparedStyles = prepareUnidirGUITacheSource(styles).pipe<Data<AnyStringRecord>, ReplayDataMediator<AnyStringRecord>>(
        emptyStartWithT_({}), replayWithLatest(1)
      )
      const preparedActuations = prepareUnidirGUITacheSource(actuations).pipe<Data<AnyStringRecord>, ReplayDataMediator<AnyStringRecord>>(
        emptyStartWithT_({}), replayWithLatest(1)
      )
      const preparedConfigs = prepareUnidirGUITacheSource(configs).pipe<Data<AnyStringRecord>, ReplayDataMediator<AnyStringRecord>>(
        emptyStartWithT_({}), replayWithLatest(1)
      )
      const preparedOutputs = prepareBidirGUITacheSource(outputs)

      const preparedSources = {
        marks: preparedMarks,
        styles: preparedStyles,
        actuations: preparedActuations,
        configs: preparedConfigs,
        outputs: preparedOutputs
      }

      // create singleton level contexts
      // scope to every single component
      const singletonLevelContexts = formatGUITacheContexts(prepareSingletonLevelContexts(
        preparedSources as unknown as PrepareGUITacheSources<S>,
        {
          useMarks: useUnidirGUITacheSource_(preparedMarks),
          useStyles: useUnidirGUITacheSource_(preparedStyles),
          useActuations: useUnidirGUITacheSource_(preparedActuations),
          useConfigs: useUnidirGUITacheSource_(preparedConfigs),
          useOutputs: useBidirGUITacheSource_(preparedOutputs),
          tacheOptions: options,
          tacheLevelContexts
        }
      ))

      const combinedOutputs = replayWithLatest(1, combineT(outputs))

      const GUITacheInput = {
        marks: preparedMarks,
        styles: preparedStyles,
        actuations: preparedActuations,
        configs: preparedConfigs,
        outputs: combinedOutputs,
        singletonLevelContexts: singletonLevelContexts
      }
      return GUITacheInput
    },
    prepareMidpiece: (options, tacheLevelContexts, inputs) => {
      const mutation = Mutation.ofLiftBoth<any, Out | Terminator>(
        (prev, template, mutation) => {
          if (isVacuo(prev)) return TERMINATOR

          const { marks, styles, actuations, configs, outputs, singletonLevelContexts } = prev

          return prepareTemplate(
            { marks, styles, actuations, configs, outputs, singletonLevelContexts },
            template as Out,
            mutation as Mutation<any, Out>,
            { tacheOptions: options, ...ELEMENT_MAKER_UTILS }
          )
        })
      return mutation as GUITacheMidpiece<any, Out>
    },
    prepareOutput: (options, tacheLevelContexts, midpieces) => {
      const { enableReplay } = { ...DEFAULT_GUI_TACHE_OPTIONS, ...options }

      if (enableReplay) {
        return replayWithLatest(1, Data.empty<Out>())
      } else {
        return Data.empty<Out>()
      }
    },
    connect: (options, tacheLevelContexts, [inputs, midpieces, outputs]) => {
      const inputsRD = replayWithLatest(1, combineLatestT(inputs))
      pipeAtom(inputsRD, midpieces, outputs)
    }
  }

  return createGeneralTache_(uiTacheCreateOptions)
}

/**
 * @see {@link createGUITache}, {@link useGUITache_}
 */
export const useGUITache = useGeneralTache
/**
 * @see {@link createGUITache}, {@link useGUITache}
 */
export const useGUITache_ = useGeneralTache_

/******************************************************************************************************
 *
 *                                           Type Tests
 *
 ******************************************************************************************************/

/**
 *
 */
interface MockTacheOptions extends GUITacheOptions { tacheOptionsField: string }
interface MockTacheLevelContexts extends GUITacheLevelContexts { tacheLevelContextsField: number }
interface MockSingletonLevelContexts extends GUITacheSingletonLevelContexts { singletonLevelContextsField: boolean }
interface MockGUISources extends GUITacheSources {
  styles: {
    name: string
    age?: number
  }
  outputs?: {
    alive: boolean
  }
}
const mockGUITache = createGUITache<MockTacheOptions, MockTacheLevelContexts, MockSingletonLevelContexts, MockGUISources>({
  prepareOptions: (options) => {
    // options should have a property called tacheOptionsField which is be typed as string
    return options
  },
  prepareTacheLevelContexts: () => {
    // returned value should have a property called tacheLevelContextsField which is be typed as number
    return { tacheLevelContextsField: 1 }
  },
  prepareSingletonLevelContexts: (sources, contexts) => {
    // sources should have all 'marks', 'styles', 'actuations', 'configs', 'outputs' properties
    const sourcesTypes = sources
    // values of 'styles', 'outputs' properties should be typed as { name: string, age: number } and { name: number } respectively
    const sourcesStyles = sourcesTypes.styles
    const sourcesOutputs = sourcesTypes.outputs
    // 'tacheOptions' and 'tacheLevelContexts' properties in contexts
    //   should be typed as MockTacheOptions and MockTacheLevelContexts respectively
    const tacheOptions = contexts.tacheOptions
    const tacheLevelContexts = contexts.tacheLevelContexts
    // the second argument(defaultValue) of 'useStyles', 'useOutputs' methods in contexts
    //   should be correctly typed by manually specify the type variable before invoke them
    const ageBeTypedAsNumber = contexts.useStyles<'age'>('age', 23)
    const nameBeTypedAsString = contexts.useStyles<'name'>('name', 'cigaret')
    // `use` series methods in contexts whose defaultValue's type not be specified should be infered as any
    const aliveBeTypedAsAny = contexts.useOutputs('alive', true)

    // returned value should have a property called singletonLevelContextsField which is be typed as AtomLikeOfOutput<boolean>
    return { singletonLevelContextsField: Data.of<boolean>(true) }
  },
  prepareTemplate: (templateOptions, template, mutation, contexts) => {
    // templateOptions should have all 'marks', 'styles', 'actuations', 'configs', 'outputs' properties
    //   these properties should be same as them in MockGUISources
    const marks = templateOptions.marks
    const styles = templateOptions.styles
    // templateOptions should have a property called singletonLevelContextsField which is be typed as MockSingletonLevelContexts
    const singletonLevelContexts = templateOptions.singletonLevelContexts.singletonLevelContextsField
    // contexts should have a property called tacheOptions which is be typed as MockTacheOptions
    const tacheOptions = contexts.tacheOptions
    // other properties in contexts should be same as them in ElementMakerUtils
    const { tacheOptions: _tacheOptions, ...utils } = contexts
    const { html, view } = utils
    return view({ marks })``
  }
})

const mockGUIInstance = mockGUITache()({ styles: { name: 'cigaret' } })

const otherMockGUIInstance = useGUITache_(mockGUITache, undefined, {
  styles: { name: 'cigaret' }
})
