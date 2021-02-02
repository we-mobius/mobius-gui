import { makeComponentMaker } from '../helpers/index.js'
import { makeMiddleRowAdaptiveLayoutE } from '../elements/index.js'

export const makeMiddleRowAdaptiveLayoutC = makeComponentMaker({
  handler: ({ marks, styles, actuations, configs }) => {
    return makeMiddleRowAdaptiveLayoutE({ marks, styles, actuations, configs })
  }
})
