import { makeTacheFormatComponent, useUITache } from '../helpers/index.js'
import { makeInputE } from '../elements/input.js'

export const inputTC = makeTacheFormatComponent({
  prepareTemplate: ({ marks, styles, actuations, configs, singletonLevelContexts }, template, mutation, contexts) => {
    return makeInputE({ marks, styles, actuations, configs })
  }
})

export const useInputTC = useUITache(inputTC)
