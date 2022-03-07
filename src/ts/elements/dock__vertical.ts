import { toClassString } from 'MobiusUtils'
import { html, unsafeSVG } from '../libs/lit-html'
import { createElementMaker } from '../helpers/index'

import type { ClassUnion, EventHandler } from 'MobiusUtils'
import type { HTMLTemplateResult, TemplateResult } from '../libs/lit-html'
import type { ElementOptions } from '../helpers/index'

export interface DockItem {
  icon: string | { type: 'preset', class: string } | { type: 'custom', class: string } | { type: 'svg', path: string, viewBox: string }
  title?: string
  route: string
  /**
   * @default false
   */
  isSelected?: boolean
}
export interface LeftDockElementOptions extends ElementOptions {
  styles?: {
    classes?: ClassUnion
    itemDirection?: 'horizontal' | 'vertical'
    isShow?: boolean
    isTitleShow?: boolean
    items?: DockItem[]
  }
  actuations?: {
    clickHandler?: EventHandler<HTMLDivElement>
  }
}
interface DockItemMakeOptions extends DockItem {
  clickHandler: EventHandler<HTMLDivElement>
  isTitleShow: boolean
  itemDirection: 'horizontal' | 'vertical'
}

const formatItemIcon = (icon: DockItem['icon'], isSmall: boolean): TemplateResult => {
  const spanTextSize = isSmall ? 'mobius-text--2xl' : 'mobius-text--4xl'
  const svgBoxSize = isSmall ? '1.5em' : '2em'

  if (typeof icon === 'string') {
    return html`<span class="mobius-events--none mobius-icon mobius-icon-${icon} mobius-text-leading--xs ${spanTextSize}"></span>`
  } else if (icon.type === 'preset') {
    return html`<span class="mobius-events--none mobius-icon mobius-icon-${icon.class} mobius-text-leading--xs ${spanTextSize}"></span>`
  } else if (icon.type === 'custom') {
    return html`<span class="mobius-events--none mobius-icon ${icon.class} mobius-text-leading--xs ${spanTextSize}"></span>`
  } else if (icon.type === 'svg') {
    return html`${unsafeSVG(`
      <svg class="mobius-events--none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgBoxSize}" height="${svgBoxSize}" viewBox="${icon.viewBox}">
        ${icon.path}
      </svg>
    `)}`
  } else {
    return html`Invalid Icon.`
  }
}
const makeDockItem = (itemInfo: DockItemMakeOptions): HTMLTemplateResult => {
  const { icon, title, itemDirection: direction, isTitleShow, route, clickHandler, isSelected = false } = itemInfo
  const view = html`
    <div
      class="mobius-layout__${direction} mobius-padding--r-base mobius-cursor--pointer ${isSelected ? 'mobius-text--primary' : ''}"
      @click=${clickHandler} data-page="${route}" title="${title ?? ''}"
    >
      ${formatItemIcon(icon, direction === 'horizontal')}
      ${isTitleShow ? html`<span class="mobius-events--none ${direction === 'horizontal' ? 'mobius-padding-left--xs' : ''}">${title}</span>` : ''}
    </div>
  `
  return view
}

/**
 * @param styles.classes Classes of dock wrapper.
 * @param styles.isShow Whether to show the dock.
 * @param styles.isTitleShow Whether to show the item"s title.
 * @param styles.items Items options of dock.
 */
export const makeVerticalDockE = createElementMaker<LeftDockElementOptions>({
  marks: {},
  styles: {
    classes: '',
    itemDirection: 'vertical',
    isShow: true,
    isTitleShow: false,
    items: []
  },
  actuations: {
    clickHandler: (event) => event
  },
  configs: {},
  prepareTemplate: (view, { styles, actuations, utils: { html } }) => {
    const { classes, itemDirection, isShow, isTitleShow, items } = styles
    const { clickHandler } = actuations

    const dockItems = items
      .map(itemInfo => ({ ...itemInfo, itemDirection, isTitleShow, clickHandler }))
      .map(makeDockItem)

    return html`
      <div class="${toClassString(classes)}" style="display: ${isShow ? 'block' : 'none'};">
        ${dockItems}
      </div>
    `
  }
})
