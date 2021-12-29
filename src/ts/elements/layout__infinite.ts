import { createElementMaker } from '../helpers/index'
import { repeat, html } from '../libs/lit-html'

import type { ElementOptions } from '../helpers/index'
import type { TemplateResult } from '../libs/lit-html'

export interface InfiniteLayoutElementBlock {
  coordinates: [number, number, number]
  alias?: string
  slot?: any
}

export interface InfiniteLayoutElement extends ElementOptions {
  styles?: {
    blocks?: InfiniteLayoutElementBlock[]
  }
}

/**
 * @param styles.blocks - data of blocks.
 */
export const makeInfiniteLayoutE = createElementMaker<InfiniteLayoutElement>({
  marks: {},
  styles: {
    blocks: []
  },
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles: { blocks } }) => {
    // sort blocks by (min z) -> (min y) -> (min x)
    const sortedBlocks = [...blocks].sort(({ coordinates: [x0, y0, z0] }, { coordinates: [x1, y1, z1] }) => {
      // smaller z will be placed at bottom
      if (z0 < z1) return -1
      if (z0 > z1) return 1
      // if z0 === z1, then compare y
      // smaller y will be placed at bottom
      if (y0 < y1) return -1
      if (y0 > y1) return 1
      // if y0 === y1, then compare x
      // smaller x will be placed at bottom
      if (x0 < x1) return -1
      if (x0 > x1) return 1

      return 0
    })

    // use block data to build up TemplateResult
    const prepareBlock = (block: InfiniteLayoutElementBlock): TemplateResult => {
      const { coordinates: [x, y, z], slot, alias } = block
      return html`
      <div
        data-coord='${JSON.stringify([x, y, z])}'
        data-alias='${alias ?? ''}'
        style='position: absolute; left: ${x * 100}%; top: ${y * 100}%; width: 100%; height: 100%;'
      >
        ${slot}
      </div>
    `
    }

    // use repeat directive for performance consideration
    // write `block => prepareBlock(block)` instead of only `prepareBlock` for unexpected behaviors
    return view`
      ${repeat(sortedBlocks, block => JSON.stringify(block.coordinates), block => prepareBlock(block))}
    `
  }
})
