import { makeTacheFormatComponent, useUITache } from '../helpers/index.js'
import { makeMiddleRowAdaptiveLayoutE } from '../elements/index.js'

export const middleRowAdaptiveLayoutTC = makeTacheFormatComponent({
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeMiddleRowAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})

export const useMiddleRowAdaptiveLayoutTC = useUITache(middleRowAdaptiveLayoutTC)
