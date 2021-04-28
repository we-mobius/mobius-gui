import {
  isObject, isArray, isFunction,
  getByPath,
  compose, looseCurryN,
  Mutation, Data,
  isData, isMutation, isAtom,
  replayWithLatest, pipeAtom, binaryTweenPipeAtom,
  mutationToDataS,
  asIsDistinctPreviousT, startWithT,
  combineT, combineLatestT, pluckT, nilToVoidT, defaultToT
} from '../libs/mobius-utils.js'
import { elementMakerUtilsContexts } from './element.js'

/**
 * @param { object } option Object, { Atom, Any }
 * @return { Atom } ReplayData of combined options
 */
export const makeUnidirComponentOption = option => {
  if (isAtom(option)) {
    return replayWithLatest(1, option)
  }
  const rawOption = Object.entries(option).reduce((acc, [key, value]) => {
    acc[key] = isAtom(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
    return acc
  }, {})
  return replayWithLatest(1, combineLatestT(rawOption))
}

/**
 * @param { object } option
 * @return { object } option
 */
export const makeBidirComponentOption = option => {
  const rawOption = Object.entries(option).reduce((acc, [key, value]) => {
    acc[key] = isAtom(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
    return acc
  }, {})
  return rawOption
}

/**
 * @param option Atom, Atom of component option Object
 * @param key String, option name
 * @param defaultValue Any
 * @param options Object, Optional, { nilToVoid = true, isDistinct = true, isReplay = true }
 * @return atom Data
 */
export const useUnidirComponentOption = looseCurryN(3, (option, key, defaultValue, options = {}) => {
  if (!isAtom(option)) {
    throw (new TypeError('"optionD" argument of useComponentOption is expected to be type of "Atom".'))
  }

  const { nilToVoid = true, isDistinct = true, isReplay = true } = options
  const taches = [pluckT(key)]
  if (nilToVoid) {
    taches.push(nilToVoidT)
  }
  taches.push(defaultToT(defaultValue))
  if (isDistinct) {
    taches.push(asIsDistinctPreviousT)
  }
  if (isReplay) {
    taches.push(replayWithLatest(1))
  }

  // ensure res have the latest value when optionD is repalyable
  const tempD = Data.empty()
  const res = tempD.pipe(...taches)

  binaryTweenPipeAtom(option, tempD)

  return res
})

export const useBidirComponentOption = looseCurryN(3, (option, key, defaultValue, options = {}) => {
  if (!isObject(option)) {
    throw (new TypeError(`"option" is expected to be type of "Object", but received "${typeof option}".`))
  }

  const atom = getByPath(key, option) || (isAtom(defaultValue) ? defaultValue : Data.of(defaultValue))

  return replayWithLatest(1, atom)
})

/**
 * @param input Data | Array | Object
 * @param operation Function, operation in Mutation
 * @param output Data, optional
 * @return Data of TemplateResult
 */
export const makeComponent = (input, operation, output) => {
  const outputD = output || Data.empty()

  let inputD
  if (isArray(input)) {
    inputD = combineLatestT(input)
  } else if (isMutation(input)) {
    inputD = mutationToDataS(input)
  } else if (isData(input)) {
    inputD = input
  } else if (isObject(input)) {
    inputD = combineLatestT(input)
  } else {
    throw (new TypeError('Unexpected "input" of makeComponentD.'))
  }

  const inputRD = replayWithLatest(1, inputD)
  pipeAtom(inputRD, Mutation.ofLiftBoth(operation), outputD)

  return outputD
}

/**
 * @param contexts Any
 * @return ReplayMediator
 */
const formatContexts = contexts => {
  if (isAtom(contexts)) {
    // do nothing
  } else if (isObject(contexts) || isArray(contexts)) {
    contexts = combineLatestT(contexts)
  } else {
    contexts = Data.of(contexts)
  }
  return replayWithLatest(1, contexts)
}

/**
 * @param input Data | Array | Object
 * @param operation Function, operation in Mutation
 * @param output Data, optional
 * @return RD of TemplateResult
 */
export const makeComponentWithReplay = compose(replayWithLatest(1), makeComponent)

/**
 * @param prepareComponentLevelContexts Function, takes nothing, returns Object or Function, when returns a function,
 *                                      the function will be called before handler called,
 *                                      with { marks, styles, actuations, configs } as its arguments,
 *                                      then the result of that call will be passed to handler as componentLevelContexts.
 * @param prepareSingletonLevelContexts Function, same as `prepareComponentLevelContexts`, but will be called with
 *                                      { marks(D), styles(D), actuations(D), configs(D) } as its auguments.
 * @param handler Function, takes { marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts }
 *                as argument, returns TemplateResult as result
 * @return ComponentMaker
 */
export const makeComponentMaker = ({
  prepareComponentLevelContexts = () => replayWithLatest(1, Data.of({})),
  prepareSingletonLevelContexts = () => replayWithLatest(1, Data.of({})),
  handler
}) => {
  // create component level contexts
  // scope to all of the same type of component instance
  const componentLevelContexts = formatContexts(prepareComponentLevelContexts())

  /**
   * CompontentMaker Function, be used to makeComponent
   *
   * @param marks Data, default to {}
   * @param styles Data, default to {}
   * @param actuations Data, default to {}
   * @param configs Data, default to {}
   * @param { object } outputs Object, default to {}
   * @return RD of TemplateResult
   */
  const makeComponent = ({
    marks = replayWithLatest(1, Data.of({})),
    styles = replayWithLatest(1, Data.of({})),
    actuations = replayWithLatest(1, Data.of({})),
    configs = replayWithLatest(1, Data.of({})),
    outputs = {}
  } = {}) => {
    // process options
    marks = makeUnidirComponentOption(marks)
    styles = makeUnidirComponentOption(styles)
    actuations = makeUnidirComponentOption(actuations).pipe(startWithT({}), replayWithLatest(1))
    configs = makeUnidirComponentOption(configs)
    outputs = makeBidirComponentOption(outputs)

    // create singleton level contexts
    // scope to every single component
    const singletonLevelContexts = formatContexts(prepareSingletonLevelContexts(
      { marks, styles, actuations, configs, outputs },
      {
        useMarks: useUnidirComponentOption(marks),
        useStyles: useUnidirComponentOption(styles),
        useActuations: useUnidirComponentOption(actuations),
        useConfigs: useUnidirComponentOption(configs),
        useOutputs: useBidirComponentOption(outputs)
      }
    ))

    const _outputs = replayWithLatest(1, combineT(outputs))

    // components are replay with latest by default
    return makeComponentWithReplay(
      { marks, styles, actuations, configs, outputs: _outputs, singletonLevelContexts, componentLevelContexts },
      ({ marks, styles, actuations, configs, outputs, singletonLevelContexts, componentLevelContexts }, template) => {
        if (isFunction(singletonLevelContexts)) {
          singletonLevelContexts = singletonLevelContexts({ marks, styles, actuations, configs })
        }
        if (isFunction(componentLevelContexts)) {
          componentLevelContexts = componentLevelContexts({ marks, styles, actuations, configs })
        }

        // use component level contexts or singleton level contexts in handler
        return handler(
          { marks, styles, actuations, configs, outputs, singletonLevelContexts, componentLevelContexts },
          template,
          { ...elementMakerUtilsContexts }
        )
      }
    )
  }
  return makeComponent
}
