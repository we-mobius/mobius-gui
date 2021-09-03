import {
  isObject, isArray, isFunction,
  looseCurryN,
  Mutation, Data,
  isData, isMutation,
  replayWithLatest, pipeAtom,
  mutationToDataS,
  combineLatestT
} from '../libs/mobius-utils'
import {
  nothing
} from '../libs/lit-html'
import { elementMakerUtilsContexts } from './element'
import { makeUITache } from './ui-tache'
import { makeUIDriver } from './ui-driver'

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

  // enableOutlier: 设置为 true 之后，将使用 nothing 作为组件的初始值，即使在应用启动的时候 sources 没有输出值，也不影响程序整体运行
  const { enableReplay = true, liftType = 'both', enableOutlier = true } = options

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
    inputD = replayWithLatest(1, Data.of(sources))
  }

  const inputRD = replayWithLatest(1, inputD)
  const mutation = Mutation.ofLift((...args) => {
    return operation(...args, { ...elementMakerUtilsContexts })
  }, { liftType })
  let output = enableOutlier ? Data.of(nothing) : Data.empty()

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
