import {
  compose,
  Data, Mutation, isAtom,
  replayWithLatest, pipeAtom,
  combineLatestT,
  makeGeneralDriver
} from '../libs/mobius-utils.js'
import { elementMakerUtilsContexts } from './element.js'

const atomize = tar => {
  if (isAtom(tar)) return tar
  const rawOption = Object.entries(tar).reduce((acc, [key, value]) => {
    acc[key] = isAtom(value) ? replayWithLatest(1, value) : replayWithLatest(1, Data.of(value))
    return acc
  }, {})
  return rawOption
}

export const makeUIDriver = ({
  prepareOptions = _ => _,
  prepareDriverLevelContexts = () => ({}),
  prepareSingletonLevelContexts = () => ({}),
  prepareTemplate = () => {}
} = {}) => {
  const driver = makeGeneralDriver({
    prepareOptions: (options) => {
      return prepareOptions(options)
    },
    prepareDriverLevelContexts: () => {
      return prepareDriverLevelContexts()
    },
    prepareSingletonLevelContexts: (options, driverLevelContexts) => {
      return prepareSingletonLevelContexts(options, driverLevelContexts)
    },
    main: (options, driverLevelContexts, singletonLevelContexts) => {
      // extract options
      const { enableReplay = true } = options

      let { inputs: { marks, styles, actuations, configs }, outputs } = singletonLevelContexts

      const _processOption = compose(replayWithLatest(1), combineLatestT, atomize)

      // process options
      marks = _processOption(marks)
      styles = _processOption(styles)
      actuations = _processOption(actuations)
      configs = _processOption(configs)

      // build template
      const uiInputsRD = replayWithLatest(1, combineLatestT({ marks, styles, actuations, configs }))
      const template = enableReplay ? replayWithLatest(1, Data.empty()) : Data.empty()
      pipeAtom(uiInputsRD, Mutation.ofLiftBoth(({ marks, styles, actuations, configs }, template) => {
        return prepareTemplate({ marks, styles, actuations, configs }, template, { ...elementMakerUtilsContexts })
      }), template)

      // format outputs
      outputs = atomize(outputs)

      return {
        inputs: { marks, styles, actuations, configs },
        outputs: { template: template, ...outputs }
      }
    }
  })

  return driver
}
