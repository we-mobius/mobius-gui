import { isArray, isUndefined } from '../libs/mobius-utils'
import { html } from '../libs/lit-html'
import { createElementMaker } from '../helpers/index'

import type { TemplateResult } from '../libs/lit-html'
import type { ElementOptions } from '../helpers/index'

const TOOLBAR_ITEM_TEMPLATE_FACTORY = {
  normal: (normalItem: ToolbarElementNormalItem): TemplateResult => {
    const { opType, icon, title, eventHandler } = normalItem
    return html`
      <div
        class='mobius-padding--xs mobius-bg--normal mobius-text--center mobius-text-leading--xs mobius-cursor--pointer hover_mobius-text--primary hover_mobius-bg--second'
        title='${title}' data-op-type='${opType}' @click=${eventHandler}
      >
        <span class='mobius-icon matrix-icon-${icon} mobius-text--xl mobius-text--bold mobius-events--none'></span>
      </div>
    `
  },
  divider: (divider: ToolbarElementDividerItem): TemplateResult => {
    const { direction } = divider
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
}

function itemToTemplate (item: ToolbarElementItem): TemplateResult {
  const { type } = item
  return TOOLBAR_ITEM_TEMPLATE_FACTORY[type as NonNullable<typeof type>](item as any)
}

const formatItems = (
  items: Array<ToolbarElementItem | ToolbarElementItem[]>, options: { divider: ToolbarElementDividerItem }
): Array<ToolbarElementItem | ToolbarElementDividerItem> => {
  const { divider } = options

  const isDivider = (tar: any): tar is ToolbarElementDividerItem => tar.type === divider.type

  // step1 - flatten item groups and insert dividers
  const formattedStep1 = items.reduce<ToolbarElementItem[]>((acc, cur, idx, arr) => {
    if (isArray(cur)) {
      acc.push(...cur)
      if (!isUndefined(arr[idx + 1])) {
        acc.push(divider)
      }
    } else {
      acc.push(cur)
      if (!isUndefined(arr[idx + 1]) && isArray(arr[idx + 1])) {
        acc.push(divider)
      }
    }
    return acc
  }, [])
  const formattedStep2 = formattedStep1.reduce<ToolbarElementItem[]>((acc, cur, idx, arr) => {
    // remove the divider that was incorrectly inserted into the beginning
    if (idx === 0 && isDivider(cur)) return acc

    // remove duplicate dividers
    if (!isUndefined(arr[idx + 1])) {
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

  return formattedStep2
}

export type ToolbarElementItem = ToolbarElementNormalItem | ToolbarElementDividerItem
export interface ToolbarElementNormalItem {
  type?: 'normal'
  opType: string
  icon: string
  title: string
  eventHandler?: (event: Event) => void
}
export interface ToolbarElementDividerItem {
  type: 'divider'
  direction: ToolbarElementDirection
}

export type ToolbarElementDirection = 'horizontal' | 'vertical'
export interface ToolbarElementOptions extends ElementOptions {
  styles?: {
    // TODO: more accurate position type
    position?: string
    direction?: ToolbarElementDirection
    items?: Array<ToolbarElementItem | ToolbarElementItem[]>
  }
  actuations?: {
    eventHandler?: (event: Event) => void
  }
}

/**
 *
 */
export const makeToolbarE = createElementMaker<ToolbarElementOptions>({
  marks: {},
  styles: {
    position: 'lt',
    direction: 'horizontal',
    items: [{ type: 'normal', opType: 'experiment', icon: 'experiment', title: 'Experiment Feature' }]
  },
  actuations: {
    eventHandler: e => { console.warn('Toolbar need an eventHandler!') }
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations, utils: { prefix } }) => {
    const { items, position, direction } = styles
    const { eventHandler } = actuations

    const posClass = (pos: string): string => `position--${pos}`
    const dirClass = (dir: string): string => `layout__${dir} mobius-flex-wrap--nowrap`
    const rootClasses = prefix(`position--absolute ${posClass(position)} margin--base bg--normal border--all rounded--xs overflow--hidden ${dirClass(direction)}`)

    // format items
    const formattedItems: Array<ToolbarElementItem | ToolbarElementDividerItem> = formatItems(
      items, { divider: { type: 'divider', direction } }
    ).map(item => {
      const preparedItem = { ...item }
      preparedItem.type = item.type ?? 'normal'

      if (preparedItem.type === 'divider') {
        preparedItem.direction = direction
      } else if (preparedItem.type === 'normal') {
        // ! latest eventHandler takes highest priority
        preparedItem.eventHandler = eventHandler ?? (item as ToolbarElementNormalItem).eventHandler
      }

      return preparedItem
    })

    // items to templates
    const itemTemplates = formattedItems.map(itemToTemplate)

    return view`
      <div class='${rootClasses}'>
        ${[
          ...itemTemplates
        ]}
      </div>
    `
  }
})
