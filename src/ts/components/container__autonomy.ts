import {
  looseCurryN,
  makeUniqueString,
  Data,
  replayWithLatest,
  startWithT
} from '../libs/mobius-utils'
import {
  makeDriverFormatComponent, useUIDriver,
  idToNodeT
} from '../helpers/index'

/**
 * @param { { styles: { rootClasses?: Data } } } inputs
 * @return { { id: Data, container: Data } } outputs
 */
export const autonomyContainerDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idRD = replayWithLatest(1, Data.of(makeUniqueString('autonomy-container')))
    const containerRD = idRD.pipe(idToNodeT(100), replayWithLatest(1))

    const rootClassesD = Data.empty()

    return {
      inputs: {
        styles: {
          rootClasses: rootClassesD
        }
      },
      _internals: {
        marks: {
          id: idRD
        },
        styles: {
          rootClasses: rootClassesD
        }
      },
      outputs: {
        id: idRD,
        container: containerRD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, { html }) => {
    const { id } = marks
    const { rootClasses } = styles

    return html`
      <div id=${id} class=${rootClasses}>Awesome autonomy container!</div>
    `
  }
})

export const useAutonomyContainerDC = looseCurryN(2, (driverOptions, interfaces) => {
  const res = useUIDriver(autonomyContainerDC, driverOptions, interfaces)
  const { template, container } = res.outputs
  res.outputs.app = replayWithLatest(1, startWithT(template, container))
  return res
})
