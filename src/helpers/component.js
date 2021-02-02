import {
  isString, isObject, isArray, isFunction,
  compose, looseCurryN,
  Mutation, Data,
  isData, isMutation, isAtom,
  replayWithLatest, pipeAtom,
  asIsDistinctPreviousT,
  combineLatestT, pluckT, nilToVoidT, defaultToT
} from '../libs/mobius-utils.js'

/**
 * @param option Object, { Atom, Any }
 * @return option Object, { Atom }
 */
export const makeComponentOption = option => {
  const rawOption = Object.entries(option).reduce((acc, [key, value]) => {
    acc[key] = isAtom(value) ? value : replayWithLatest(1, Data.of(value))
    return acc
  }, {})
  return combineLatestT(rawOption)
}

/**
 * @param option Data, Data of component option Object
 * @param key String, option name
 * @param defaultValue Any
 * @param options Object, Optional, { nilToVoid = true, isDistinct = true, isReplay = true }
 * @return atom Data
 */
export const useComponentOption = looseCurryN(3, (optionD, key, defaultValue, options = {}) => {
  if (!isData(optionD)) {
    throw (new TypeError('"optionD" argument of useComponentOption is expected to be type of "Data".'))
  }
  if (!isString(key)) {
    throw (new TypeError('"key" argument of useComponentOption is expected to be type of "String".'))
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
  return optionD.pipe(...taches)
})

/**
 * @param input Data | Array | Object
 * @param operation Function, operation in Mutation
 * @param output Data, optional
 * @return RD of TemplateResult
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
  const componentLevelContexts = prepareComponentLevelContexts()

  /**
   * CompontentMaker Function, be used to makeComponent
   *
   * @param marks Data, default to {}
   * @param styles Data, default to {}
   * @param actuations Data, default to {}
   * @param configs Data, default to {}
   * @return RD of TemplateResult
   */
  const makeComponent = ({
    marks = replayWithLatest(1, Data.of({})),
    styles = replayWithLatest(1, Data.of({})),
    actuations = replayWithLatest(1, Data.of({})),
    configs = replayWithLatest(1, Data.of({}))
  } = {}) => {
    // check options
    if (!isAtom(marks)) {
      marks = makeComponentOption(marks)
    }
    if (!isAtom(styles)) {
      styles = makeComponentOption(styles)
    }
    if (!isAtom(actuations)) {
      actuations = makeComponentOption(actuations)
    }
    if (!isAtom(configs)) {
      configs = makeComponentOption(configs)
    }
    // create singleton level contexts
    // scope to every single component
    const singletonLevelContexts = prepareSingletonLevelContexts(
      { marks, styles, actuations, configs },
      {
        useMarks: useComponentOption(marks),
        useStyles: useComponentOption(styles),
        useActuations: useComponentOption(actuations),
        useConfigs: useComponentOption(configs)
      }
    )

    // components are replay with latest by default
    return makeComponentWithReplay(
      { marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts },
      ({ marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts }) => {
        if (isFunction(singletonLevelContexts)) {
          singletonLevelContexts = singletonLevelContexts({ marks, styles, actuations, configs })
        }
        if (isFunction(componentLevelContexts)) {
          componentLevelContexts = componentLevelContexts({ marks, styles, actuations, configs })
        }

        // use component level contexts or singleton level contexts in handler
        return handler({ marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts })
      }
    )
  }
  return makeComponent
}
