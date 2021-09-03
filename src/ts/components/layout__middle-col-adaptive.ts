import { makeTacheFormatComponent, useUITache } from '../helpers/index'
import { makeMiddleColAdaptiveLayoutE } from '../elements/index'

export const middleColAdaptiveLayoutTC = makeTacheFormatComponent({
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeMiddleColAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})

export const useMiddleColAdaptiveLayoutTC = useUITache(middleColAdaptiveLayoutTC)
