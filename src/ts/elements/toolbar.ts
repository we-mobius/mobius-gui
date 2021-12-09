import { isArray } from '../libs/mobius-utils'
import { html } from '../libs/lit-html'
import { createElementMaker } from '../helpers/index'

const normal = ({ opType, icon, title, eventHandler }) => {
  return html`
    <div
      class='mobius-padding--xs mobius-bg--normal mobius-text--center mobius-text-leading--xs mobius-cursor--pointer hover_mobius-text--primary hover_mobius-bg--second'
      title='${title}' data-op-type='${opType}' @click=${eventHandler}
    >
      <span class='mobius-icon matrix-icon-${icon} mobius-text--xl mobius-text--bold mobius-events--none'></span>
    </div>
  `
}
const divider = ({ direction }) => {
  const margin = {
    horizontal: 'mobius-margin-x--xs',
    vertical: 'mobius-margin-y--xs'
  }
  const size = {
    horizontal: 'width: 1px; height: 1em;',
    vertical: 'width: 1em; height: 1px;'
  }

  return html`
    <div class='mobius-bg--normal ${margin[direction]}' style=${size[direction]}>
      <div class='mobius-bg--mean mobius-size--fullpct' style='opacity: 0.75;'></span>
    </div>
  `
}
const MARKER_DICT = {
  normal: normal,
  divider: divider
}
const itemToTemplate = item => {
  const { type } = item
  return MARKER_DICT[type](item)
}

const formatItems = (items, { dividerItem }) => {
  const isDivider = tar => tar.type === dividerItem.type
  items = items.reduce((acc, cur, idx, arr) => {
    if (isArray(cur)) {
      acc.push(...cur)
      if (arr[idx + 1]) {
        acc.push(dividerItem)
      }
    } else {
      acc.push(cur)
      if (arr[idx + 1] && isArray(arr[idx + 1])) {
        acc.push(dividerItem)
      }
    }
    return acc
  }, [])
  items = items.reduce((acc, cur, idx, arr) => {
    if (idx === 0 && isDivider(cur)) return acc

    if (arr[idx + 1]) {
      if (!isDivider(cur)) {
        acc.push(cur)
      } else {
        if (!isDivider(arr[idx + 1])) {
          acc.push(cur)
        }
      }
    } else {
      if (!isDivider(cur)) {
        acc.push(cur)
      }
    }
    return acc
  }, [])
  return items
}

export const makeToolbarE = createElementMaker({
  marks: {},
  styles: {
    position: 'lt',
    direction: 'horizontal',
    /**
     * ```
     *   [[{ type: string, opType: string, icon: string, title: string }] | { type: string, opType: string, icon: string, title: string }, ...]
     * ```
     */
    items: [{ opType: 'experiment', icon: 'experiment', title: 'Experiment Feature' }]
  },
  actuations: {
    eventHandler: e => { console.warn('Toolbar need an eventHandler!') }
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations, utils: { prefix, html } }) => {
    let { items, position, direction } = styles
    const { eventHandler } = actuations

    const posClass = pos => `position--${pos}`
    const dirClass = dir => `layout__${dir} mobius-flex-wrap--nowrap`
    const _rootClasses = prefix(`position--absolute ${posClass(position)} margin--base bg--normal border--all rounded--xs overflow--hidden ${dirClass(direction)}`)

    // format items
    items = formatItems(items, { dividerItem: { type: 'divider', direction } }).map(item => {
      item.type = item.type || 'normal'
      if (item.type === 'divider') {
        item.direction = direction
      }
      // ! latest eventHandler takes highest priority
      item.eventHandler = eventHandler || item.eventHandler
      return item
    })

    // items to templates
    const itemTemplates = items.map(itemToTemplate)

    return view`
      <div class='${_rootClasses}'>
        ${[
          ...itemTemplates
        ]}
      </div>
    `
  }
})
