import {
  isObject, isArray,
  getByPath,
  looseCurryN,
  Data, Mutation, isAtom,
  replayWithLatest,
  pipeAtom, binaryTweenPipeAtom,
  combineLatestT, emptyStartWithT, pluckT, defaultToT, nilToVoidT, asIsDistinctPreviousT, combineT,
  createGeneralTache, useGeneralTache
} from '../libs/mobius-utils.js'
import { elementMakerUtilsContexts } from './element.js'

/**
 * @param { object } source Object, { Atom, Any }
 * @return { Atom } ReplayData of combined sources
 */
export const makeUnidirUITacheSource = source => {
  if (isAtom(source)) {
    return replayWithLatest(1, source)
  }
  const rawOption = Object.entries(source).reduce((acc, [key, value]) => {
    acc[key] = isAtom(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
    return acc
  }, {})

  return replayWithLatest(1, combineLatestT(rawOption))
}

/**
 * @param { object } source
 * @return { object } sources
 */
export const makeBidirUITacheSource = source => {
  const rawOption = Object.entries(source).reduce((acc, [key, value]) => {
    acc[key] = isAtom(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
    return acc
  }, {})
  return rawOption
}

/**
 * @param source Atom, Atom of tache source Object
 * @param key String, source name
 * @param defaultValue Any
 * @param options Object, Optional, { nilToVoid = true, isDistinct = true, isReplay = true }
 * @return atom Data
 */
export const useUnidirUITacheSource = looseCurryN(3, (source, key, defaultValue, options = {}) => {
  if (!isAtom(source)) {
    throw (new TypeError('"source" is expected to be type of "Atom".'))
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

  binaryTweenPipeAtom(source, tempD)

  return res
})

export const useBidirUITacheSource = looseCurryN(3, (source, key, defaultValue, options = {}) => {
  if (!isObject(source)) {
    throw (new TypeError(`"source" is expected to be type of "Object", but received "${typeof source}".`))
  }

  const atom = getByPath(key, source) || (isAtom(defaultValue) ? defaultValue : Data.of(defaultValue))

  return replayWithLatest(1, atom)
})

/**
 * @param contexts Any
 * @return ReplayMediator
 */
const formatUITacheContexts = contexts => {
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
 * 调用之后返回一个 partial applied function，称其为 tacheMaker
 *   -> tacheMaker 是一个函数，该函数接受 options 参数用于调整 tache 的行为
 *   -> tacheMaker 使用之后返回一个函数，该函数即是 tache
 *     -> tache 函数接受一组输入，然后返回一组输出，输出通常是 Atom of TemplateResult
 *
 * @param { {
 *   prepareOptions?: ((options: object) => object),
 *   prepareTacheLevelContexts?: (() => any),
 *   prepareSingletonLevelContexts?: ((
 *    { marks, styles, actuations, configs, outputs },
 *    { useMarks, useStyles, useActuations, useConfigs, useOutputs, options, driverLevelContexts }
 *   ) => object),
 *   prepareTemplate: ((
 *    { marks: object, styles: object, actuations: object, configs: object },
 *    template,
 *    contexts
 *   ) => TemplateResult)
 * } }
 */
export const makeUITache = ({
  prepareOptions = options => options,
  prepareTacheLevelContexts = () => ({}),
  prepareSingletonLevelContexts = () => replayWithLatest(1, Data.of({})),
  prepareTemplate = () => 'function prepareTemplate is not defined!'
} = {}) => {
  return createGeneralTache({
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
      let {
        marks = replayWithLatest(1, Data.of({})),
        styles = replayWithLatest(1, Data.of({})),
        actuations = replayWithLatest(1, Data.of({})),
        configs = replayWithLatest(1, Data.of({})),
        outputs = {}
      } = sources

      // process options
      marks = makeUnidirUITacheSource(marks).pipe(emptyStartWithT({}), replayWithLatest(1))
      styles = makeUnidirUITacheSource(styles).pipe(emptyStartWithT({}), replayWithLatest(1))
      actuations = makeUnidirUITacheSource(actuations).pipe(emptyStartWithT({}), replayWithLatest(1))
      configs = makeUnidirUITacheSource(configs).pipe(emptyStartWithT({}), replayWithLatest(1))
      outputs = makeBidirUITacheSource(outputs)

      // create singleton level contexts
      // scope to every single component
      const singletonLevelContexts = formatUITacheContexts(prepareSingletonLevelContexts(
        { marks, styles, actuations, configs, outputs },
        {
          useMarks: useUnidirUITacheSource(marks),
          useStyles: useUnidirUITacheSource(styles),
          useActuations: useUnidirUITacheSource(actuations),
          useConfigs: useUnidirUITacheSource(configs),
          useOutputs: useBidirUITacheSource(outputs),
          tacheOptions: options,
          tacheLevelContexts,
          componentLevelContexts: tacheLevelContexts
        }
      ))

      const _outputs = combineT(outputs).pipe(replayWithLatest(1))

      return { marks, styles, actuations, configs, outputs: _outputs, singletonLevelContexts }
    },
    prepareMidpiece: (options, tacheLevelContexts, inputs) => {
      const mutation = Mutation.ofLiftBoth(
        ({ marks, styles, actuations, configs, outputs, singletonLevelContexts }, template, mutation) => {
          return prepareTemplate(
            { marks, styles, actuations, configs, outputs, singletonLevelContexts },
            template,
            mutation,
            { tacheOptions: options, ...elementMakerUtilsContexts }
          )
        })
      return mutation
    },
    prepareOutput: (options, tacheLevelContexts, midpieces) => {
      const { enableReplay = true } = options
      let output = Data.empty()
      if (enableReplay) {
        output = replayWithLatest(1, output)
      }
      return output
    },
    connect: (options, tacheLevelContexts, [inputs, midpieces, outputs]) => {
      const inputsRD = combineLatestT(inputs).pipe(replayWithLatest(1))
      pipeAtom(inputsRD, midpieces, outputs)
    }
  })
}

export const useUITache = useGeneralTache
