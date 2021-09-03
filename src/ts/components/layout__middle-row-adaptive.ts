import { makeTacheFormatComponent, useUITache } from '../helpers/index'
import { makeMiddleRowAdaptiveLayoutE } from '../elements/index'

export const middleRowAdaptiveLayoutTC = makeTacheFormatComponent({
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeMiddleRowAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})

export const useMiddleRowAdaptiveLayoutTC = useUITache(middleRowAdaptiveLayoutTC)
