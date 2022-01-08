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
import type { TemplateResult, RenderOptions } from '../libs/lit-html'

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

interface RunAppOptions extends RenderOptions {
  render?: typeof r
  enableLog?: boolean
}
const DEFAULT_RUN_APP_OPTIONS: Required<Omit<RunAppOptions, keyof RenderOptions>> = {
  render: r,
  enableLog: true
}

/**
 * @param container App Container wrapped in Atom which will be used to place app.
 * @param template TemplateResult wrapped in Atom.
 * @param render Render function which takes TemplateResult & container DOM element,
 *               render TemplateResult to container DOM.
 *
 * @see {@link runSimpleApp}
 */
export const runApp = <Container extends HTMLElement | DocumentFragment, Template extends TemplateResult>(
  container: AtomLikeOfOutput<Container>,
  template: AtomLikeOfOutput<Template>,
  options: RunAppOptions = DEFAULT_RUN_APP_OPTIONS
): DataSubscription<[Container, Template]> => {
  const preparedOptions = { ...DEFAULT_RUN_APP_OPTIONS, ...options }
  const { render, enableLog } = preparedOptions

  const renderTargetRD = replayWithLatest(1, (combineLatestT(container, template)))

  return renderTargetRD.subscribeValue(([container, template]) => {
    if (enableLog) {
      console.log('[MobiusApp] render App: ', container, template)
    }
    render(template, container, preparedOptions)
  })
}

interface RunSimpleAppOptions extends RunAppOptions {
  decorator?: ((container: HTMLElement) => void) | Partial<HTMLElement>
}
const DEFAULT_RUN_SIMPLE_APP_OPTIONS: Required<Omit<RunSimpleAppOptions, keyof RenderOptions>> = {
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
export const runSimpleApp = <Template extends TemplateResult>(
  container: HTMLElement | DocumentFragment | string,
  template: AtomLikeOfOutput<Template>,
  options: RunSimpleAppOptions = DEFAULT_RUN_SIMPLE_APP_OPTIONS
): DataSubscription<Template> => {
  const preparedOptions = { ...DEFAULT_RUN_SIMPLE_APP_OPTIONS, ...options }
  const { render, enableLog, decorator } = preparedOptions

  console.log('[MobiusSimpleApp] initialize start!')
  const preparedContainer = isString(container) ? initAppContainer(container, decorator) : container
  console.log('[MobiusSimpleApp] App will be rendered in container: ', container)

  return holdLatestUntilT(completeStateRD, template).subscribeValue((template) => {
    if (enableLog) {
      console.log('[MobiusSimpleApp] render App: ', container, template)
    }
    render(template, preparedContainer, preparedOptions)
  })
}
