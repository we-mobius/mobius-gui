import {
  makeDriverFormatComponent, useUIDriver
} from '../helpers/index'
import {
  makeInfiniteLayoutE
} from '../elements/index'
import {
  Data,
  replayWithLatest,
  binaryTweenPipeAtom
} from '../libs/mobius-utils'

export const infiniteLayoutDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const blocksInD = Data.empty()

    const blocksRD = replayWithLatest(1, Data.empty())

    binaryTweenPipeAtom(blocksInD, blocksRD)

    return {
      inputs: {
        configs: {
          blocks: blocksInD
        }
      },
      _internals: {
        configs: {
          blocks: blocksRD
        }
      },
      outputs: {
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, contexts) => {
    return makeInfiniteLayoutE({ marks, styles, actuations, configs })
  }
})

export const useInfiniteLayoutDC = useUIDriver(infiniteLayoutDC)
