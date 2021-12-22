import {
  isPlainObject, isFunction, isString,
  Mutation, Data,
  replayWithLatest, pipeAtom,
  combineLatestT, holdLatestUntilT,
  completeStateRD
} from '../libs/mobius-utils'
import { render as r } from '../libs/lit-html'

import type {
  AtomLikeOfOutput,
  ReplayDataMediator,
  DataSubscription
} from '../libs/mobius-utils'
import type { TemplateResult } from '../libs/lit-html'

/**
 * Init app container(`div` element) with given `containerId`.
 *
 * @param containerId id of container
 *
 * @see {@link makeAppContainerRD}
 */
export const initAppContainer = (
  id: string, decorator?: ((container: HTMLElement) => void) | Partial<HTMLElement>
): HTMLElement => {
  let preparedContainer: HTMLElement

  const container = document.getElementById(id)
  if (container === null) {
    preparedContainer = document.createElement('div')
    preparedContainer.id = id
    document.body.appendChild(preparedContainer)
  } else {
    preparedContainer = container
  }

  if (isFunction(decorator)) {
    decorator(preparedContainer)
  } else if (isPlainObject(decorator)) {
    Object.entries(decorator).forEach(([key, value]) => {
      (preparedContainer as { [key: string]: any })[key] = value
    })
  }

  return preparedContainer
}

/**
 * When DocumentReadyState changes to `complete`,
 *   init app container(`div` element) with given `containerId`.
 *
 * @param containerId id of container
 *
 * @see {@link initAppContainer}
 */
export const makeAppContainerRD = (
  containerId: string, decorator?: ((container: HTMLElement) => void) | Partial<HTMLElement>
): ReplayDataMediator<HTMLElement> => {
  const toAppContainerM = Mutation.of(() => {
    const container = initAppContainer(containerId, decorator)
    return container
  })

  const appContainerD = Data.empty<HTMLElement>()
  pipeAtom(completeStateRD, toAppContainerM, appContainerD)

  const appContainerRD = replayWithLatest(1, appContainerD)

  return appContainerRD
}

interface RunAppOptions {
  render?: typeof r
  isLogOn?: boolean
}
const DEFAULT_RUN_APP_OPTIONS: Required<RunAppOptions> = {
  render: r,
  isLogOn: true
}

/**
 * @param container App Container wrapped in Atom which will be used to place app.
 * @param template TemplateResult wrapped in Atom.
 * @param render Render function which takes TemplateResult & container DOM element,
 *               render TemplateResult to container DOM.
 *
 * @see {@link runSimpleApp}
 */
export const runApp = (
  container: AtomLikeOfOutput<HTMLElement>,
  template: AtomLikeOfOutput<TemplateResult<any>>,
  options: RunAppOptions = DEFAULT_RUN_APP_OPTIONS
): DataSubscription<[HTMLElement, TemplateResult]> => {
  const { render, isLogOn } = { ...DEFAULT_RUN_APP_OPTIONS, ...options }

  const renderTargetRD = replayWithLatest(1, (combineLatestT(container, template)))

  return renderTargetRD.subscribeValue(([container, template]) => {
    if (isLogOn) {
      console.log('[MobiusApp] render App: ', container, template)
    }
    render(template, container)
  })
}

interface RunSimpleAppOptions extends RunAppOptions {
  decorator?: ((container: HTMLElement) => void) | Partial<HTMLElement>
}
const DEFAULT_RUN_SIMPLE_APP_OPTIONS: Required<RunSimpleAppOptions> = {
  ...DEFAULT_RUN_APP_OPTIONS,
  decorator: () => { /** do nothing */ }
}

/**
 * @param container Id of target app container element or prepared container element,
 *                  if id is provided, use {@link initAppContainer} to prepare container.
 * @param template TemplateResult wrapped in Atom.
 * @param render Render function which takes TemplateResult & container DOM element,
 *               render TemplateResult to container DOM.
 *
 * @see {@link runApp}
 */
export const runSimpleApp = (
  container: HTMLElement | string,
  template: AtomLikeOfOutput<TemplateResult<any>>,
  options: RunSimpleAppOptions = DEFAULT_RUN_SIMPLE_APP_OPTIONS
): DataSubscription<any> => {
  const { render, isLogOn, decorator } = { ...DEFAULT_RUN_SIMPLE_APP_OPTIONS, ...options }

  console.log('[MobiusSimpleApp] initialize start!')
  const preparedContainer = isString(container) ? initAppContainer(container, decorator) : container
  console.log('[MobiusSimpleApp] App will be rendered in container: ', container)

  return holdLatestUntilT(completeStateRD, template).subscribeValue((template) => {
    if (isLogOn) {
      console.log('[MobiusSimpleApp] render App: ', container, template)
    }
    render(template, preparedContainer)
  })
}
