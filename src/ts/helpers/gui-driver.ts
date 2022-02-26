import {
  isPlainObject, isFunction, pipe,
  Data, Mutation, isData, isAtomLike, isVacuo, TERMINATOR,
  replayWithLatest, pipeAtom,
  combineLatestT, emptyStartWithT_,
  createGeneralDriver, useGeneralDriver, useGeneralDriver_,
  DEFAULT_DRIVER_OPTIONS
} from '../libs/mobius-utils'
import { nothing } from '../libs/lit-html'
import { ELEMENT_MAKER_UTILS } from './element'
import { DEFAULT_COMPONENT_COMMON_OPTIONS } from './component.common'

import type {
  AnyStringRecord, IsAny, FlipOptional,
  Terminator,
  DataLike, AtomLike, AtomLikeOfOutput,
  ReplayDataMediator,
  DriverOptions, DriverLevelContexts, DriverSingletonLevelContexts, GeneralDriverCreateOptions
} from '../libs/mobius-utils'
import type { ElementMakerUtils, HyperElementOptions } from './element'
import type { TemplateResult } from '../libs/lit-html'
import type { ComponentCommonOptions } from './component.common'

export type IUseGUIDriver = typeof useGeneralDriver
export type { IUseGeneralDriver_ as IUseGUIDriver_, IPartialUseGeneralDriver_ as IPartialUseGUIDriver_ } from '../libs/mobius-utils'

/************************************************************************************************
 *
 *                                    Auxiliary function
 *
 ************************************************************************************************/

/**
 *
 */
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

/**
 *
 */

// loop A to provide full `templateOptions` suggestion to `prepareTemplate` method
type MergeInners<Default extends AnyStringRecord, Target extends AnyStringRecord> = {
  [P in keyof Default]: P extends 'marks' | 'styles' | 'actuations' | 'configs' ? (
    Default[P] extends AnyStringRecord | undefined ? (
      // if target[P] is not defined, it will be unknown, just return Default[P] for that case
      Target[P] extends unknown ?
        Default[P] : (
          Target[P] extends AnyStringRecord | undefined ? (
          // if property of `Target` is extends the same property of `Default`, just return it, otherwise return mergence
            (Target[P] | undefined) extends (Default[P] | undefined) ? Target[P] : Default[P] & Target[P]
          ) : [Target, P, Target[P], '1is expected to be type of "AnyStringRecord"']
        )
    ) : [Default, P, Default[P], 'is expected to be type of "AnyStringRecord"']
  ) : P extends string ? (
    (Target[P] | undefined) extends (Default[P] | undefined) ?
      Target[P] : [Target, P, Target[P], 'is expected to be type of', Default[P]]
  ) : never
}
// loop B to add extra properties other than 'inputs' and 'outputs' to TargetContext
type DeepMergeDefault<Default extends AnyStringRecord, Target extends AnyStringRecord> = {
  [P in keyof Target]: P extends 'outputs' ? (
    Target[P] extends AnyStringRecord | undefined ? (
      Default[P] extends AnyStringRecord | undefined ? (
        // if property of `Target` is extends the same property of `Default`, just return it, otherwise return mergence
        (Target[P] | undefined) extends (Default[P] | undefined) ? Target[P] : Default[P] & Target[P]
      ) : [Default, P, Default[P], 'is expected to be type of "AnyStringRecord"']
    ) : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : P extends 'inputs' ? (
    // NOTE: 由于 Data._mutator 的存在，在组件中使用 HyperElementOptions 会引入相当麻烦的问题，决定不引入该功能
    // HyperElementOptions<MergeInners<NonNullable<Default[P]>, NonNullable<Target[P]>> & NonNullable<Target[P]>>
    MergeInners<NonNullable<Default[P]>, NonNullable<Target[P]>> & NonNullable<Target[P]>
  ) : P extends '_internals' ? (
    MergeInners<NonNullable<Default[P]>, NonNullable<Target[P]>> & NonNullable<Target[P]>
  ) : Target[P]
}

// quote in one-arity tuple to avoid union distribution
// @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type AtomizeToD<Target> = IsAny<Target> extends true ? (
  Data<any>
) : [Target] extends [AtomLike] ? Target : (
  [Target] extends [Exclude<Target, undefined>] ?
    Data<Target> : (Data<Exclude<Target, undefined>> | undefined)
)
type AtomizeRecordToD<Target extends AnyStringRecord | undefined> = {
  [P in keyof Target]: AtomizeToD<Target[P]>
}
// quote in one-arity tuple to avoid union distribution
// @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type AtomizeToRD<Target> = IsAny<Target> extends true ? (
  ReplayDataMediator<any>
) : [Target] extends [AtomLike] ? Target : (
  [Target] extends [Exclude<Target, undefined>] ?
    ReplayDataMediator<Target> : (ReplayDataMediator<Exclude<Target, undefined>> | undefined)
)
type AtomizeRecordToRD<Target extends AnyStringRecord | undefined> = {
  [P in keyof Target]: AtomizeToRD<Target[P]>
}
// quote in one-arity tuple to avoid union distribution
// @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type Atomize<Target> = IsAny<Target> extends true ? (
  ReplayDataMediator<any> | Data<any>
) : [Target] extends [AtomLike] ? Target : (
  [Target] extends [Exclude<Target, undefined>] ? (
    ReplayDataMediator<Target> | Data<Target>
  ) : (
    ReplayDataMediator<Exclude<Target, undefined>> | Data<Exclude<Target, undefined>> | undefined
  )
)
type AtomizeRecord<Target extends AnyStringRecord | undefined> = {
  [P in keyof Target]: Atomize<Target[P]>
}
type AtomizeRecordValuesToD<Target extends AnyStringRecord | undefined> = {
  [P in keyof Target]: P extends 'marks' | 'styles' | 'actuations' | 'configs' ? (
    Target[P] extends AnyStringRecord | undefined ?
      AtomizeRecordToD<Target[P]> : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : AtomizeToD<Target[P]>
}
type AtomizeRecordValuesToRD<Target extends AnyStringRecord | undefined> = {
  [P in keyof Target]: P extends 'marks' | 'styles' | 'actuations' | 'configs' ? (
    Target[P] extends AnyStringRecord | undefined ?
      AtomizeRecordToRD<Target[P]> : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : AtomizeToRD<Target[P]>
}
type AtomizeRecordValues<Target extends AnyStringRecord | undefined> = {
  [P in keyof Target]: P extends 'marks' | 'styles' | 'actuations' | 'configs' ? (
    Target[P] extends AnyStringRecord | undefined ?
      AtomizeRecord<Target[P]> : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : Atomize<Target[P]>
}

//  loop all properties and map necessary properties to `Atomize`,
//    e.g. properties of 'inputs' and 'outputs', and properties of '_internals' property's childs
type AtomizeNecessary<Target extends AnyStringRecord> = {
  [P in keyof Target]: P extends 'outputs' ? (
    Target[P] extends AnyStringRecord | undefined ? (
      AtomizeRecordToRD<Target[P]>
    ) : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : P extends 'inputs' ? (
    Target[P] extends AnyStringRecord | undefined ? (
      AtomizeRecordValues<Target[P]>
    ) : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : P extends '_internals' ? (
    Target[P] extends AnyStringRecord | undefined ? (
      AtomizeRecordValuesToRD<Target[P]>
    ) : [Target, P, Target[P], 'is expected to be type of "AnyStringRecord"']
  ) : Target[P]
}

type PrepareGUIDLC<Target> = AtomizeNecessary<DeepMergeDefault<GUIDriverLevelContexts, Target> & Record<string, any>>
type PrepareGUIDSLC<Target> = AtomizeNecessary<DeepMergeDefault<GUIDriverSingletonLevelContexts, Target> & Record<string, any>>

/************************************************************************************************
 *
 *                                           Main Types
 *
 ************************************************************************************************/

/**
 *
 */
export interface GUIDriverOptions extends DriverOptions, ComponentCommonOptions { }
const DEFAULT_GUI_DRIVER_OPTIONS: Required<GUIDriverOptions> = {
  ...DEFAULT_DRIVER_OPTIONS,
  ...DEFAULT_COMPONENT_COMMON_OPTIONS
}
export interface GUIDriverLevelContexts extends DriverLevelContexts { }
export interface GUIDriverSingletonLevelContexts extends DriverSingletonLevelContexts {
  inputs?: {
    marks?: AnyStringRecord
    styles?: AnyStringRecord
    actuations?: AnyStringRecord
    configs?: AnyStringRecord
  }
  _internals?: {
    marks?: AnyStringRecord
    styles?: AnyStringRecord
    actuations?: AnyStringRecord
    configs?: AnyStringRecord
  }
}
const DEFAULT_GUI_DRIVER_SINGLETON_LEVEL_CONTEXTS: Required<GUIDriverSingletonLevelContexts> = {
  inputs: {
    marks: {},
    styles: {},
    actuations: {},
    configs: {}
  },
  _internals: {
    marks: {},
    styles: {},
    actuations: {},
    configs: {}
  },
  outputs: {}
}

type ChildrenRequired<T> = {
  [P in keyof T]-?: T[P] extends (Record<string, any> | undefined) ? Required<T[P]> : T[P]
}

export type PrepareGUIDriverSingletonLevelContexts<
  Options extends DriverOptions = DriverOptions,
  DLC extends DriverLevelContexts = DriverLevelContexts,
  DSLC extends DriverSingletonLevelContexts = DriverSingletonLevelContexts
> =
  (options: Required<Options>, driverLevelContexts: PrepareGUIDLC<DLC>) => PrepareGUIDSLC<DSLC>
type PrepareGUIDriverInstance<
  DSLC extends GUIDriverSingletonLevelContexts = GUIDriverSingletonLevelContexts,
  Template = TemplateResult
> = {
  inputs: PrepareGUIDSLC<DSLC>['inputs']
  outputs: PrepareGUIDSLC<DSLC>['outputs']
} & { outputs: { template: DataLike<Template> } }

export interface GUIDriverCreateOptions<
  Options extends GUIDriverOptions = GUIDriverOptions,
  DLC extends GUIDriverLevelContexts = GUIDriverLevelContexts,
  DSLC extends GUIDriverSingletonLevelContexts = GUIDriverSingletonLevelContexts,
  Template = TemplateResult
> {
  defaultOptions?: FlipOptional<Options>
  prepareOptions?: (options: Required<Options>) => Required<Options>
  prepareDriverLevelContexts?: () => PrepareGUIDLC<DLC>
  prepareSingletonLevelContexts?: PrepareGUIDriverSingletonLevelContexts<Options, DLC, DSLC>
  prepareTemplate: (
    templateOptions: ChildrenRequired<DeepMergeDefault<GUIDriverSingletonLevelContexts, DSLC>['_internals']>,
    prevTemplate: Template,
    mutation: Mutation<any, Template>,
    contexts: ElementMakerUtils & { driverOptions: Required<Options> }
  ) => Template
  prepareInstance?: (
    options: Required<Options>, instance: PrepareGUIDriverInstance<DSLC, Template>
  ) => PrepareGUIDriverInstance<DSLC, Template>
}

const DEFAULT_GUI_DRIVER_CREATE_OPTIONS: Required<GUIDriverCreateOptions<any, any, any, any>> = {
  defaultOptions: DEFAULT_GUI_DRIVER_OPTIONS,
  prepareOptions: (options: any) => options,
  prepareDriverLevelContexts: () => ({ }),
  prepareSingletonLevelContexts: () => ({ }),
  prepareTemplate: () => 'function prepareTemplate is not defined!',
  prepareInstance: (options, instance) => instance
}

export type GUIDriverMaker<
  Options extends GUIDriverOptions = GUIDriverOptions,
  DSLC extends GUIDriverSingletonLevelContexts = GUIDriverSingletonLevelContexts,
  Template = TemplateResult
> = (options?: Options) => PrepareGUIDriverInstance<DSLC, Template>

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
export const createGUIDriver = <
  Options extends GUIDriverOptions = GUIDriverOptions,
  DLC extends GUIDriverLevelContexts = GUIDriverLevelContexts,
  DSLC extends GUIDriverSingletonLevelContexts = GUIDriverSingletonLevelContexts,
  Template = TemplateResult
>(
    createOptions: GUIDriverCreateOptions<Options, DLC, DSLC, Template> |
    PrepareGUIDriverSingletonLevelContexts<Options, DLC, DSLC> = DEFAULT_GUI_DRIVER_CREATE_OPTIONS as any
  ): GUIDriverMaker<Options, DSLC, Template> => {
  if (!isPlainObject(createOptions) && !isFunction(createOptions)) {
    throw (new TypeError('"createOptions" is expected to be type of "PlainObject" | "Function".'))
  }

  let preparedCreateOptions: Required<GUIDriverCreateOptions<Options, DLC, DSLC, Template>>
  if (isFunction(createOptions)) {
    preparedCreateOptions = { ...DEFAULT_GUI_DRIVER_CREATE_OPTIONS as any, prepareSingletonLevelContexts: createOptions }
  } else {
    preparedCreateOptions = { ...DEFAULT_GUI_DRIVER_CREATE_OPTIONS as any, ...createOptions }
  }

  const {
    defaultOptions,
    prepareOptions,
    prepareDriverLevelContexts,
    prepareSingletonLevelContexts,
    prepareTemplate,
    prepareInstance
  } = preparedCreateOptions

  const uiDriverCreateOptions: GeneralDriverCreateOptions<
  Options,
  PrepareGUIDLC<DLC>,
  PrepareGUIDSLC<DSLC>,
  PrepareGUIDriverInstance<DSLC, Template>
  > = {
    defaultOptions: defaultOptions,
    prepareOptions: (options) => {
      return prepareOptions({ ...DEFAULT_GUI_DRIVER_OPTIONS, ...options })
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
      const { enableAsync: isAsync, enableReplay, enableOutlier } = options as (typeof DEFAULT_GUI_DRIVER_OPTIONS & Options)

      const { inputs, _internals, outputs } = { ...DEFAULT_GUI_DRIVER_SINGLETON_LEVEL_CONTEXTS, ...singletonLevelContexts }
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

      let preparedTemplate: DataLike<Template>
      if (enableOutlier) {
        preparedTemplate = Data.of<Template>(nothing as unknown as Template, { isAsync })
      } else {
        preparedTemplate = Data.empty<Template>({ isAsync })
      }
      if (enableReplay) {
        preparedTemplate = replayWithLatest(1, preparedTemplate)
      }

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
          },
          { isAsync }
        ),
        preparedTemplate
      )

      // format inputs & outputs
      //   -> inputs don't need to be formatted
      const formattedOutputs = atomize(outputs)

      const instance = {
        inputs: { ...inputs as AnyStringRecord },
        outputs: { template: preparedTemplate, ...formattedOutputs as AnyStringRecord }
      } as unknown as PrepareGUIDriverInstance<DSLC, Template>

      const preparedInstance = prepareInstance(options, instance)

      return preparedInstance
    }
  }

  return createGeneralDriver(uiDriverCreateOptions)
}

/**
 * @see {@link createGUIDriver}, {@link useGUIDriver_}
 */
export const useGUIDriver = useGeneralDriver
/**
 * @see {@link createGUIDriver}, {@link useGUIDriver}
 */
export const useGUIDriver_ = useGeneralDriver_

/******************************************************************************************************
 *
 *                                           Type Tests
 *
 ******************************************************************************************************/

/**
 *
 */
interface MockDriverOptions extends GUIDriverOptions { driverOptionsField: string }
interface MockDriverLevelContexts extends GUIDriverLevelContexts {
  driverLevelContextsField: string
  outputs: {
    name?: number
  }
}
interface MockDriverSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  singletonLevelContextsField: string
  inputs: {
    styles: {
      book: number
    }
    otherBook: number
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

const mockGUIDriver = createGUIDriver<
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
      inputs: {
        styles: {
          book: Data.of(1)
        },
        otherBook: Data.of(1)
      },
      outputs: { love: replayWithLatest(1, Data.of(Symbol('love'))) },
      _internals: {
        marks: { name: replayWithLatest(1, Data.of('cigaret')) }
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

const mockGUIInstance = mockGUIDriver({
  driverOptionsField: 'driverOptionsField'
})

const { inputs, outputs } = mockGUIInstance

const otherMockGUIInstance = useGUIDriver_(mockGUIDriver)({ enableAsync: true, driverOptionsField: '' }, {
  inputs: { styles: { book: 1 }, otherBook: 1 }, outputs: { love: Data.of(Symbol(1)) }
})

const template = otherMockGUIInstance.outputs.template
