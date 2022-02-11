import { toClassString } from 'MobiusUtils'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion } from 'MobiusUtils'
import type { ElementOptions } from '../helpers/index'

export interface LadderElementOptions extends ElementOptions {
  styles?: {
    classes?: ClassUnion
    contents?: any[]
    rungHeight?: number
  }
}

/**
 * @param styles.classes - Classes of the wrapper.
 * @param styles.contents - Contents of the ladder.
 */
export const makeLadderE = createElementMaker<LadderElementOptions>({
  marks: {},
  styles: {
    classes: '',
    contents: [],
    rungHeight: 0
  },
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles, utils: { html } }) => {
    const { classes, rungHeight, contents } = styles

    const preparedContents: any[] = []
    if (rungHeight > 0) {
      const rung = html`<div style="height: ${rungHeight}px; align-self: stretch;"></div>`
      contents.forEach((item, index, array) => {
        if (index === array.length - 1) {
          preparedContents.push(item)
        } else {
          preparedContents.push(item, rung)
        }
      })
    } else {
      preparedContents.push(...contents)
    }

    return view`
      <div class="mobius-layout__vertical ${toClassString(classes)}">
        ${preparedContents}
      </div>
    `
  }
})
