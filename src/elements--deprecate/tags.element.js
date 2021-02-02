import { div } from '../libs/dom.js'
import { hardDeepMerge } from '../libs/mobius-utils.js'
import { makeUniqueSelector } from '../common/index.js'
import { makeForB } from '../blocks/for.block.js'
import { makeTagE } from './tag.element.js'

const makeTagVNode = ({ text, selected, value }) => {
  return makeTagE({
    selector: '.js_mobius-tags__tag.mobius-margin-right--r-xs',
    config: { text, selected, value }
  })
}

export const makeTagsE = elementOptions => {
  const {
    unique, selector = '', props = {}, children = undefined, config = {}
  } = elementOptions

  const { list } = config
  const makeUnique = makeUniqueSelector(unique)

  return div(
    `${makeUnique('')}.js_mobius-tags${selector}.mobius-padding-y--r-base.mobius-scroll--x.mobius-scrollbar--hidden.mobius-select--none`,
    hardDeepMerge(props, {
      dataset: { unique },
      style: {
        'border-bottom': '1px solid hsla(264, 0%, 68%, 50%)'
      }
    }),
    [
      div(
        '.mobius-padding-x--r-base.mobius-layout__horizontal.mobius-flex-wrap--nowrap.mobius-margin-last--none',
        { style: { width: 'max-content' } },
        [
          ...makeForB({
            config: {
              data: list,
              target: makeTagVNode
            }
          })
        ]
      )
    ]
  )
}
