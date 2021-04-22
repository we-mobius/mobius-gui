import { makeComponentMaker } from '../helpers/index.js'
import { makeInputE } from '../elements/input.js'

export const makeInputC = makeComponentMaker({
  prepareSingletonLevelContexts: (options, contexts) => {

  },
  handler: ({ marks, styles, actuations, configs, singletonLevelContexts, componentLevelContexts }) => {
    return makeInputE({ marks, styles, actuations, configs })
  }
})
