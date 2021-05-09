import {
  compose,
  Data, Mutation, isAtom,
  replayWithLatest, pipeAtom,
  combineLatestT, emptyStartWithT,
  createGeneralDriver, useGeneralDriver
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

/**
 * 调用之后返回一个 driver
 *   -> driver 是一个函数，该函数接受 options 参数用于调整 driver 的行为
 *   -> driver 调用之后返回两组接口，分别是 inputs 和 outputs
 *     -> inputs 是输入项，包括 marks、styles、actuations、configs
 *     -> outputs 是输出项，包括 template 和其它
 *
 * @param { {
 *   prepareOptions?: ((options: object) => object),
 *   prepareDriverLevelContexts?: ((options: object) => object),
 *   prepareSingletonLevelContexts?: ((options: object, driverLevelContexts: object) => object),
 *   prepareTemplate: ((
 *    { marks: object, styles: object, actuations: object, configs: object },
 *    template,
 *    contexts
 *   ) => TemplateResult)
 * } }
 */
export const makeUIDriver = ({
  prepareOptions = options => options,
  prepareDriverLevelContexts = () => ({}),
  prepareSingletonLevelContexts = () => ({}),
  prepareTemplate = () => 'function prepareTemplate is not defined!'
} = {}) => {
  const driver = createGeneralDriver({
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
      const { enableReplay = true } = options

      let { inputs = {}, internals: { marks = {}, styles = {}, actuations = {}, configs = {} } = {}, outputs = {} } = singletonLevelContexts

      const _processOption = compose(replayWithLatest(1), emptyStartWithT({}), combineLatestT, atomize)

      // process options
      marks = _processOption(marks)
      styles = _processOption(styles)
      actuations = _processOption(actuations)
      configs = _processOption(configs)

      // build template
      const uiInputsRD = replayWithLatest(1, combineLatestT({ marks, styles, actuations, configs }))
      const template = enableReplay ? replayWithLatest(1, Data.empty()) : Data.empty()
      pipeAtom(uiInputsRD, Mutation.ofLiftBoth(({ marks, styles, actuations, configs }, template, mutation) => {
        return prepareTemplate(
          { marks, styles, actuations, configs },
          template,
          mutation,
          { driverOptions: options, ...elementMakerUtilsContexts }
        )
      }), template)

      // format inputs & outputs
      //   -> inputs don't need to be formatted
      outputs = atomize(outputs)

      return {
        inputs: { ...inputs },
        outputs: { template: template, ...outputs }
      }
    }
  })

  return driver
}

export const useUIDriver = useGeneralDriver
