import {
  makeElementMaker
} from '../helpers/index'
import {
  repeat, html
} from '../libs/lit-html'

/**
 * @param marks Object, {}
 * @param styles Object, {}
 * @param actuations Object, {}
 * @param configs Object, {}
 * @return TemplateResult
 */
export const makeInfiniteLayoutE = makeElementMaker({
  marks: {},
  styles: {},
  actuations: {},
  configs: {
    blocks: []
  },
  handler: (view, { configs: { blocks } }) => {
    // sort blocks by (min z) -> (min y) -> (min x)
    blocks = blocks.sort(({ coord: [x0, y0, z0] }, { coord: [x1, y1, z1] }) => {
      if (z0 < z1) return -1
      if (z0 > z1) return 1
      // z0 === z1
      if (y0 < y1) return -1
      if (y0 > y1) return 1
      // z0 === z1 && y0 === y1
      if (x0 < x1) return -1
      if (x0 > x1) return 1
      // z0 === z1 && y0 === y1 && x0 === x1
      return 0
    })

    // build up TemplateResult
    blocks = blocks.map(({ coord: [x, y, z], slot, alias }) => html`
      <div
        data-coord='${JSON.stringify([x, y, z])}'
        data-alias='${alias || ''}'
        style='position: absolute; left: ${x * 100}%; top: ${y * 100}%; width: 100%; height: 100%;'
      >
        ${slot}
      </div>
    `)

    // use repeat directive for performance consideration
    return view`
      ${repeat(blocks, block => JSON.stringify(block.coord), a => a)}
    `
  }
})
