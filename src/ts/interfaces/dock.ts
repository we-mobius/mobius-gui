import { isString, binaryTweenPipeAtom, makeGeneralEventHandler, TERMINATOR } from 'MobiusUtils'
import { makeInstantComponent } from 'Helpers/component'
import { makeVerticalDockE } from 'Elements/dock__vertical'

import { appRouteDriverInstance, appNameRD } from 'Interfaces/page-services/app-route'

import type { Terminator } from 'MobiusUtils'
import type { DockItem } from 'Elements/dock__vertical'

const { inputs: { navigate } } = appRouteDriverInstance
const [clickHandlerRD, , clickD] = makeGeneralEventHandler<HTMLDivElement, string | Terminator>((event) => {
  const page = event.target.dataset.page
  return isString(page) ? `/${page}` : TERMINATOR
})
binaryTweenPipeAtom(clickD, navigate)

// @reference: svg 图标来自 https://www.xicons.org/ https://www.iconfont.cn/
const dockItems: DockItem[] = [
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M864 144H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm0 400H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zM464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm0 400H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 1024 1024'
    },
    title: 'Home',
    route: 'home'
  },
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M384 912h496c17.7 0 32-14.3 32-32V340H384v572zm496-800H384v164h528V144c0-17.7-14.3-32-32-32zm-768 32v736c0 17.7 14.3 32 32 32h176V112H144c-17.7 0-32 14.3-32 32z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 1024 1024'
    },
    title: 'Layout',
    route: 'layout'
  },
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M896 334.08v411.52l-352 204.8V539.52z m-768 0l352 205.44v410.88L128 745.6z m384-260.48l352 205.44L512 484.48 160 279.04z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 1024 1024'
    },
    title: 'Container',
    route: 'container'
  },
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M22.006 11h-12v3h12v-3zm-3 9h3v2h-3v-2zM9 4a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5H9zm-.994 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-3zm11 7h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zm-11 1a1 1 0 0 1 1-1h5a1 1 0 0 1 0 2h-5a1 1 0 0 1-1-1zm1 3h5a1 1 0 0 1 0 2h-5a1 1 0 1 1 0-2z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 32 32'
    },
    title: 'Content',
    route: 'content'
  },
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M4 3a2 2 0 0 0-1 3.732v9.518a4.25 4.25 0 0 0 4.25 4.25h6v3h-4.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5h-4.5v-3h6A4.25 4.25 0 0 0 25 16.25V6.732A2 2 0 0 0 24 3H4z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 28 28'
    },
    title: 'Display',
    route: 'display'
  },
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M21.68 9.71l-3.72 8.19c-.23.49-.96.33-.96-.21V11h-1.5c-.28 0-.5-.22-.5-.5v-6c0-.28.22-.5.5-.5h5.76c.35 0 .6.36.46.69L20 9h1.22c.37 0 .61.38.46.71zM15 13v7H4c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h11zm-8.75 3.5c0-.41-.34-.75-.75-.75s-.75.34-.75.75s.34.75.75.75s.75-.34.75-.75zM13 4v7H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h9zM6.25 7.5c0-.41-.34-.75-.75-.75s-.75.34-.75.75s.34.75.75.75s.75-.34.75-.75z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 24 24'
    },
    title: 'Form',
    route: 'form'
  },
  {
    icon: {
      type: 'svg',
      path: `
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
          fill="currentColor"
        ></path>
      `,
      viewBox: '0 0 24 24'
    },
    title: 'Help',
    route: 'help'
  }
]

export const dockRD = makeInstantComponent(
  [appNameRD, clickHandlerRD],
  ([appName, clickHandler]) => {
    return makeVerticalDockE({
      styles: {
        classes: '',
        items: dockItems.map(item => ({ ...item, isSelected: appName === item.route }))
      },
      actuations: {
        clickHandler
      }
    })
  }
)
