import { makeTacheFormatComponent, useUITache } from '../helpers/index.js'
import { makeMiddleColAdaptiveLayoutE } from '../elements/index.js'

export const middleColAdaptiveLayoutTC = makeTacheFormatComponent({
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeMiddleColAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})

export const useMiddleColAdaptiveLayoutTC = useUITache(middleColAdaptiveLayoutTC)
