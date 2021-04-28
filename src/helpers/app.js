import {
  isObject, isFunction,
  Mutation, Data, ReplayMediator,
  replayWithLatest, pipeAtom,
  combineLatestT,
  completeStateRD
} from '../libs/mobius-utils.js'
import { render as r } from '../libs/lit-html.js'

/**
 * @param containerId id of container
 * @param decorator Object | Function
 * @return RD of DOM Node (container)
 */
export const makeAppContainerRD = (containerId, decorator) => {
  const initContainer = id => {
    let container = document.getElementById(id)
    if (!container) {
      container = document.createElement('div')
      container.id = id
      document.body.appendChild(container)
    }
    if (isObject(decorator)) {
      Object.entries(decorator).forEach(([key, value]) => {
        if (isFunction(value)) {
          value(container[key])
        } else {
          container[key] = value
        }
      })
    } else if (isFunction(decorator)) {
      container = decorator(container)
    }
    return container
  }

  const toAppContainerM = Mutation.of(() => {
    const container = initContainer(containerId)
    return container
  })

  const appContainerD = Data.empty()
  pipeAtom(completeStateRD, toAppContainerM, appContainerD)

  const appContainerRD = replayWithLatest(1, appContainerD)

  return appContainerRD
}

/**
 * @param containerD Data, container Node
 * @param templateD Data, TemplateResult
 * @param render Function, takes TemplateResult & container DOM,
 *               render TemplateResult to container DOM
 * @return SubscribeController
 */
export const runApp = (containerD, templateD, render = r) => {
  const renderTargetRD = ReplayMediator.of(combineLatestT(containerD, templateD), { autoTrigger: true })
  return renderTargetRD.subscribe(({ value: [container, template] }) => {
    console.log('[runAPP] render APP', container, template)
    render(template, container)
  })
}
