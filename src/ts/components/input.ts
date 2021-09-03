import { makeTacheFormatComponent, useUITache } from '../helpers/index'
import { makeInputE } from '../elements/input'

export const inputTC = makeTacheFormatComponent({
  prepareTemplate: ({ marks, styles, actuations, configs, singletonLevelContexts }, template, mutation, contexts) => {
    return makeInputE({ marks, styles, actuations, configs })
  }
})

export const useInputTC = useUITache(inputTC)
