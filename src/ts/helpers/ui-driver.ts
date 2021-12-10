import {
  isPlainObject, isFunction, pipe,
  Data, Mutation, isData, isAtomLike, isVacuo, TERMINATOR,
  replayWithLatest, pipeAtom,
  combineLatestT, emptyStartWithT_,
  createGeneralDriver, useGeneralDriver_
} from '../libs/mobius-utils'
import { ELEMENT_MAKER_UTILS } from './element'

import type {
  Terminator,
  AtomLike, AtomLikeOfOutput,
  ReplayDataMediator,
  DriverOptions, DriverLevelContexts, DriverSingletonLevelContexts, GeneralDriverCreateOptions
} from '../libs/mobius-utils'
import type { ElementMakerUtils } from './element'
import type { TemplateResult } from '../libs/lit-html'

type AnyStringRecord = Record<string, any>

/************************************************************************************************
 *
 *                                             Auxiliary function
 *
 ************************************************************************************************/

function atomize <T extends AtomLikeOfOutput<any>> (tar: T): T
function atomize (tar: AnyStringRecord): AtomLikeOfOutput<AnyStringRecord>
function atomize (tar: any): any {
  if (isAtomLike(tar)) {
    return tar
  } else if (isPlainObject(tar)) {
    const rawOption = Object.entries(tar).reduce<Record<string, ReplayDataMediator<any>>>((acc, [key, value]) => {
      acc[key] = isData(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
      return acc
    }, {})
    return rawOption
  } else {
    throw (new TypeError('"tar" is expected to be type of "AtomLikeOfOutput" or "Record<string, any>".'))
  }
}

/************************************************************************************************
 *
 *                                      Auxiliary Types
 *
 ************************************************************************************************/

// loop A to provide full `templateOptions` suggestion to `prepareTemplate` method
type MergeInternal<A extends AnyStringRecord, B extends AnyStringRecord> = {
  [K in keyof A]-?: K extends 'marks' | 'styles' | 'actuations' | 'configs' ? (
    A[K] extends AnyStringRecord | undefined | unknown ? (
      B[K] extends AnyStringRecord | undefined | unknown ? (
        (B[K] | undefined) extends (A[K] | undefined) ? B[K] : A[K] & B[K]
      ) : [B, K, B[K], 'is expected to be type of "AnyStringRecord".']
    ) : [A, K, A[K], 'is expected to be type of "AnyStringRecord".']
  ) : never
}
// loop B to add extra properties other than 'inputs' and 'outputs' to TargetContext
type DeepMergeDefault<A extends AnyStringRecord, B extends AnyStringRecord> = {
  [K in keyof B]-?: K extends 'inputs' | 'outputs' ? (
    B[K] extends AnyStringRecord | undefined ? (
      A[K] extends AnyStringRecord | undefined ? (
        (B[K] | undefined) extends (A[K] | undefined) ? B[K] : A[K] & B[K]
      ) : [A, K, A[K], 'is expected to be type of "Record<string, any>"']
    ) : [B, K, B[K], 'is expected to be type of "Record<string, any>"']
  ) : K extends '_internals' ? (
    MergeInternal<NonNullable<A[K]>, NonNullable<B[K]>>
  ) : B[K]
}
type Atomize<T extends AnyStringRecord> = {
  [K in keyof T]: T[K] extends AtomLike ? T[K] : (
    T[K] extends Exclude<T[K], undefined> ? ReplayDataMediator<T[K]> : (ReplayDataMediator<Exclude<T[K], undefined>> | undefined)
  )
}
type AtomizeRecordValues<T extends AnyStringRecord> = {
  [K in keyof T]: T[K] extends AnyStringRecord | undefined ?
    Atomize<T[K]> : [T, K, T[K], 'is expected to be type of "Record<string, any>"']
}
//  loop all properties and map necessary properties to `Atomize`,
//    e.g. properties of 'input' and 'output', and properties of '_internals' property's childs
type AtomizeNecessary<A extends AnyStringRecord> = {
  [K in keyof A]-?: K extends 'inputs' | 'outputs' ? (
    A[K] extends AnyStringRecord | undefined ? (
      Atomize<A[K]>
    ) : [A, K, A[K], 'is expected to be type of "Record<string, any>"']
  ) : K extends '_internals' ? (
    A[K] extends AnyStringRecord | undefined ? (
      AtomizeRecordValues<A[K]>
    ) : [A, K, A[K], 'is expected to be type of "Record<string, any>"']
  ) : A[K]
}

type PrepareUIDLC<Target> = AtomizeNecessary<DeepMergeDefault<UIDriverLevelContexts, Target> & Record<string, any>>
type PrepareUIDSLC<Target> = AtomizeNecessary<DeepMergeDefault<UIDriverSingletonLevelContexts, Target> & Record<string, any>>

/************************************************************************************************
 *
 *                                           Main Types
 *
 ************************************************************************************************/

/**
 *
 */
export interface UIDriverOptions extends DriverOptions {
  enableReplay?: boolean
}
const DEFAULT_UI_DRIVER_OPTIONS: Required<UIDriverOptions> = {
  enableReplay: true
}
export interface UIDriverLevelContexts extends DriverLevelContexts {}
export interface UIDriverSingletonLevelContexts extends DriverSingletonLevelContexts {
  _internals?: {
    marks?: AnyStringRecord
    styles?: AnyStringRecord
    actuations?: AnyStringRecord
    configs?: AnyStringRecord
  }
}
const DEFAULT_UI_DRIVER_SINGLETON_LEVEL_CONTEXTS: UIDriverSingletonLevelContexts = {
  _internals: {
    marks: {},
    styles: {},
    actuations: {},
    configs: {}
  }
}

export type PrepareUIDriverSingletonLevelContexts<
  Options extends DriverOptions = DriverOptions,
  DLC extends DriverLevelContexts = DriverLevelContexts,
  DSLC extends DriverSingletonLevelContexts = DriverSingletonLevelContexts
> =
  (options: Options, driverLevelContexts: PrepareUIDLC<DLC>) => PrepareUIDSLC<DSLC>
type PrepareUIDriverInstance<
  DSLC extends UIDriverSingletonLevelContexts = UIDriverSingletonLevelContexts,
  Template = TemplateResult
> = {
  inputs: PrepareUIDSLC<DSLC>['inputs']
  outputs: PrepareUIDSLC<DSLC>['outputs']
} & { outputs: { template: ReplayDataMediator<Template> }}

export interface UIDriverCreateOptions<
  Options extends UIDriverOptions = UIDriverOptions,
  DLC extends UIDriverLevelContexts = UIDriverLevelContexts,
  DSLC extends UIDriverSingletonLevelContexts = UIDriverSingletonLevelContexts,
  Template = TemplateResult
> {
  prepareOptions?: (options: Options) => Options
  prepareDriverLevelContexts?: () => PrepareUIDLC<DLC>
  prepareSingletonLevelContexts?: PrepareUIDriverSingletonLevelContexts<Options, DLC, DSLC>
  prepareTemplate: (
    templateOptions: (DeepMergeDefault<UIDriverSingletonLevelContexts, DSLC> & Record<string, any>)['_internals'],
    prevTemplate: Template,
    mutation: Mutation<any, Template>,
    contexts: ElementMakerUtils & { driverOptions: Options }
  ) => Template
}

const DEFAULT_UI_DRIVER_CREATE_OPTIONS: any = {
  prepareOptions: (options: any) => options,
  prepareDriverLevelContexts: () => ({ }),
  prepareSingletonLevelContexts: () => ({ }),
  prepareTemplate: () => 'function prepareTemplate is not defined!'
}

export type UIDriverMaker<
  Options extends UIDriverOptions = UIDriverOptions,
  DSLC extends UIDriverSingletonLevelContexts = UIDriverSingletonLevelContexts,
  Template = TemplateResult
> = (options?: Options) => PrepareUIDriverInstance<DSLC, Template>

/************************************************************************************************
 *
 *                                            Main function
 *
 ************************************************************************************************/

/**
 * 调用之后返回一个 driver
 *   -> driver 是一个函数，该函数接受 options 参数用于调整 driver 的行为
 *   -> driver 调用之后返回两组接口，分别是 inputs 和 outputs
 *     -> inputs 是输入项，包括 marks、styles、actuations、configs
 *     -> outputs 是输出项，包括 template 和其它
 */
export const createUIDriver = <
  Options extends UIDriverOptions = UIDriverOptions,
  DLC extends UIDriverLevelContexts = UIDriverLevelContexts,
  DSLC extends UIDriverSingletonLevelContexts = UIDriverSingletonLevelContexts,
  Template = TemplateResult
>(
    createOptions: UIDriverCreateOptions<Options, DLC, DSLC, Template> |
    PrepareUIDriverSingletonLevelContexts<Options, DLC, DSLC> = DEFAULT_UI_DRIVER_CREATE_OPTIONS
  ): UIDriverMaker<Options, DSLC, Template> => {
  if (!isPlainObject(createOptions) && !isFunction(createOptions)) {
    throw (new TypeError('"createOptions" is expected to be type of "PlainObject" | "Function".'))
  }

  let preparedCreateOptions: Required<UIDriverCreateOptions<Options, DLC, DSLC, Template>>
  if (isFunction(createOptions)) {
    preparedCreateOptions = { ...DEFAULT_UI_DRIVER_CREATE_OPTIONS, prepareSingletonLevelContexts: createOptions }
  } else {
    preparedCreateOptions = { ...DEFAULT_UI_DRIVER_CREATE_OPTIONS, ...createOptions }
  }

  const {
    prepareOptions,
    prepareDriverLevelContexts,
    prepareSingletonLevelContexts,
    prepareTemplate
  } = preparedCreateOptions

  const uiDriverCreateOptions: GeneralDriverCreateOptions<
  Options,
  PrepareUIDLC<DLC>,
  PrepareUIDSLC<DSLC>,
  PrepareUIDriverInstance<DSLC, Template>
  > = {
    prepareOptions: (options) => {
      return prepareOptions(options)
    },
    prepareDriverLevelContexts: () => {
      const driverLevelContexts = prepareDriverLevelContexts()
      return driverLevelContexts
    },
    prepareSingletonLevelContexts: (options, driverLevelContexts) => {
      const singletonLevelContexts = prepareSingletonLevelContexts(options, driverLevelContexts)
      return singletonLevelContexts
    },
    prepareInstance: (options, driverLevelContexts, singletonLevelContexts) => {
      // extract options
      const { enableReplay } = { ...DEFAULT_UI_DRIVER_OPTIONS, ...options }

      const { inputs, _internals, outputs } = { ...DEFAULT_UI_DRIVER_SINGLETON_LEVEL_CONTEXTS, ...singletonLevelContexts }
      const marks = _internals?.marks ?? {}
      const styles = _internals?.styles ?? {}
      const actuations = _internals?.actuations ?? {}
      const configs = _internals?.configs ?? {}

      const _processOption = pipe<
      [AnyStringRecord | Record<string, AtomLikeOfOutput<any>>],
      AtomLikeOfOutput<any>,
      Data<AnyStringRecord>,
      Data<AnyStringRecord>,
      ReplayDataMediator<AnyStringRecord>
      >(
        atomize, combineLatestT, emptyStartWithT_({}), replayWithLatest(1)
      )

      // process options
      const preparedMarks = _processOption(marks)
      const preparedStyles = _processOption(styles)
      const preparedActuations = _processOption(actuations)
      const preparedConfigs = _processOption(configs)

      // build template
      const uiInputsRD = replayWithLatest(1, combineLatestT({
        marks: preparedMarks, styles: preparedStyles, actuations: preparedActuations, configs: preparedConfigs
      }))

      const template = enableReplay ? replayWithLatest(1, Data.empty<Template>()) : Data.empty<Template>()

      pipeAtom(
        uiInputsRD,
        Mutation.ofLiftBoth(
          (prev: any, template: Template | Terminator, mutation): Template | Terminator => {
            if (isVacuo(prev)) return TERMINATOR

            const { marks, styles, actuations, configs } = prev

            return prepareTemplate(
              { marks, styles, actuations, configs } as any,
              template as Template,
              mutation as Mutation<any, Template>,
              { driverOptions: options, ...ELEMENT_MAKER_UTILS }
            )
          }),
        template
      )

      // format inputs & outputs
      //   -> inputs don't need to be formatted
      const formattedOutputs = atomize(outputs)

      const instance = {
        inputs: { ...inputs as AnyStringRecord },
        outputs: { template: template, ...formattedOutputs as AnyStringRecord }
      }

      return instance as PrepareUIDriverInstance<DSLC, Template>
    }
  }

  return createGeneralDriver(uiDriverCreateOptions)
}

/**
 * @see {@link createUIDriver}
 */
export const useUIDriver = useGeneralDriver_

/******************************************************************************************************
 *
 *                                           Type Tests
 *
 ******************************************************************************************************/

/**
 *
 */
interface MockDriverOptions extends UIDriverOptions { driverOptionsField: string }
interface MockDriverLevelContexts extends UIDriverLevelContexts {
  driverLevelContextsField: string
  outputs: {
    name?: number
  }
}
interface MockDriverSingletonLevelContexts extends UIDriverSingletonLevelContexts {
  singletonLevelContextsField: string
  inputs: {
    book: number
  }
  outputs: {
    love: symbol
  }
  _internals: {
    marks: {
      name: string
    }
  }
}

const mockUIDriver = createUIDriver<
MockDriverOptions, MockDriverLevelContexts, MockDriverSingletonLevelContexts, TemplateResult
>({
  prepareOptions: (options) => {
    return options
  },
  // always need to manually prepare full set of returned contexts values
  prepareDriverLevelContexts: () => {
    const driverLevelContexts = { driverLevelContextsField: 'driverLevelContextsField', inputs: {}, outputs: { } }
    return driverLevelContexts
  },
  // always need to manually prepare full set of returned contexts values
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    // "options" should be type as "MockDriverOptions"
    const driverOptionsField = options.driverOptionsField
    // "driverLevelContexts" should be correctly type as prepared "MockDriverLevelContexts"
    //   i.e. "inputs" & "outputs" properties should be typed as "Atom"
    const driverLevelContextsField = driverLevelContexts.driverLevelContextsField

    const singletonLevelContexts = {
      singletonLevelContextsField: 'singletonLevelContextsField',
      inputs: { book: replayWithLatest(1, Data.of(1)) },
      outputs: { love: replayWithLatest(1, Data.of(Symbol('love'))) },
      _internals: {
        marks: { name: replayWithLatest(1, Data.of('cigaret')) },
        styles: {},
        actuations: {},
        configs: {}
      }
    }
    return singletonLevelContexts
  },
  prepareTemplate: (templateOptions, prevTemplate, mutation, contexts) => {
    const { marks, styles, actuations, configs } = templateOptions
    const { view } = contexts
    return view({ marks })``
  }
})

const mockUIInstance = mockUIDriver({
  driverOptionsField: 'driverOptionsField'
})

const { inputs, outputs } = mockUIInstance

const otherMockUIInstance = useUIDriver(mockUIDriver)(undefined, {
  inputs: { book: 1 }, outputs: { love: Data.of(Symbol(1)) }
})

const template = otherMockUIInstance.outputs.template
