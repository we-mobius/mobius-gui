import {
  isObject, isArray, isFunction,
  looseCurryN,
  Mutation, Data,
  isData, isMutation,
  replayWithLatest, pipeAtom,
  mutationToDataS,
  combineLatestT
} from '../libs/mobius-utils.js'
import { elementMakerUtilsContexts } from './element.js'
import { makeUITache } from './ui-tache.js'
import { makeUIDriver } from './ui-driver.js'

export const makeStaticComponent = (template, options = {}) => {
  if (!isObject(options)) {
    throw (new TypeError(`"options" is expected to be type of "Object", but received "${typeof options}".`))
  }

  if (isData(template)) {
    // do nothing
  } else if (isMutation(template)) {
    template = mutationToDataS(replayWithLatest(1, template))
  } else if (isFunction(template)) {
    template = Data.of(template({ ...elementMakerUtilsContexts }))
  } else {
    template = Data.of(template)
  }

  const { enableReplay = true } = options

  if (enableReplay) {
    template = replayWithLatest(1, template)
  }

  return template
}
export const makeInstantComponent = looseCurryN(2, (operation, sources, options = {}) => {
  if (!isFunction(operation) && isFunction(sources)) {
    [sources, operation] = [operation, sources]
  }
  if (!isObject(options)) {
    throw (new TypeError(`"options" is expected to be type of "Object", but received "${typeof options}".`))
  }

  const { enableReplay = true, liftType = 'both' } = options

  let inputD
  // ! detect order matters
  //   -> Array type of input is most frequent scene
  //   -> Mutation & Data is considered as normal Object.
  if (isArray(sources)) {
    inputD = combineLatestT(sources)
  } else if (isMutation(sources)) {
    inputD = mutationToDataS(replayWithLatest(1, sources))
  } else if (isData(sources)) {
    inputD = sources
  } else if (isObject(sources)) {
    inputD = combineLatestT(sources)
  } else {
    inputD = Data.of(sources)
  }

  const inputRD = replayWithLatest(1, inputD)
  const mutation = Mutation.ofLift((...args) => {
    return operation(...args, { ...elementMakerUtilsContexts })
  }, { liftType })
  let output = Data.empty()

  if (enableReplay) {
    output = replayWithLatest(1, output)
  }

  pipeAtom(inputRD, mutation, output)

  return output
})

export const makeTacheFormatComponent = makeUITache
export const makeDriverFormatComponent = makeUIDriver
export const makeTacheComponent = makeTacheFormatComponent
export const makeDriverComponent = makeDriverFormatComponent
