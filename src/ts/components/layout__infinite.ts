import {
  Data, replayWithLatest, binaryTweenPipeAtom
} from '../libs/mobius-utils'
import { makeDriverFormatComponent, useGUIDriver_ } from '../helpers/index'
import { makeInfiniteLayoutE } from '../elements/index'

import type { TemplateResult } from '../libs/lit-html'
import type { GUIDriverOptions, GUIDriverLevelContexts, GUIDriverSingletonLevelContexts } from '../helpers/index'
import type { InfiniteLayoutElementBlock } from '../elements/index'

export interface InfiniteLayoutDCSingletonLevelContexts extends GUIDriverSingletonLevelContexts {
  inputs: {
    styles: {
      blocks: InfiniteLayoutElementBlock[]
    }
  }
  _internals: {
    styles: {
      blocks: InfiniteLayoutElementBlock[]
    }
  }
}

/**
 * @param inputs.styles.blocks - data of blocks.
 */
export const makeInfiniteLayoutDC =
makeDriverFormatComponent<GUIDriverOptions, GUIDriverLevelContexts, InfiniteLayoutDCSingletonLevelContexts, TemplateResult>({
  prepareSingletonLevelContexts: () => {
    const blocksD = Data.empty<InfiniteLayoutElementBlock[]>()

    const blocksRD = replayWithLatest(1, Data.of<InfiniteLayoutElementBlock[]>([]))

    binaryTweenPipeAtom(blocksD, blocksRD)

    return {
      inputs: {
        styles: {
          blocks: blocksD
        }
      },
      _internals: {
        styles: {
          blocks: blocksRD
        }
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }) => {
    return makeInfiniteLayoutE({ marks, styles, actuations, configs })
  }
})

/**
 * @see {@link makeInfiniteLayoutDC}
 */
export const useInfiniteLayoutDC = useGUIDriver_(makeInfiniteLayoutDC)
