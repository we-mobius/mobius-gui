import { makeComponentMaker } from '../helpers/index.js'
import { makeMiddleColAdaptiveLayoutE } from '../elements/index.js'

export const makeMiddleColAdaptiveLayoutC = makeComponentMaker({
  handler: ({ marks, styles, actuations, configs }) => {
    return makeMiddleColAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})
