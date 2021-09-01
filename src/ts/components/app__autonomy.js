import {
  isArray, isString, isObject,
  makeUniqueString,
  looseCurryN,
  Data,
  replayWithLatest,
  binaryTweenPipeAtom,
  combineLatestT, takeT, mapT, filterT, startWithT
} from '../libs/mobius-utils.js'
import {
  makeDriverFormatComponent, useUIDriver,
  idToNodeT
} from '../helpers/index.js'

/**
 * @param { { styles: { rootClasses?: Data } } } inputs
 * @return { { id: Data, container: Data } } outputs
 */
export const autonomyAppDC = makeDriverFormatComponent({
  prepareSingletonLevelContexts: (options, driverLevelContexts) => {
    const idRD = replayWithLatest(1, Data.of(makeUniqueString('autonomy-app')))
    const containerRD = idRD.pipe(idToNodeT(100), replayWithLatest(1))

    const rootClassesRD = replayWithLatest(1, Data.of(''))
    const contentRD = replayWithLatest(1, Data.of(undefined))

    // step1: prepare
    const startRD = replayWithLatest(1, Data.empty())
    const scriptRD = replayWithLatest(1, Data.empty())
    const scriptsToBeLoadD = combineLatestT([scriptRD, startRD]).pipe(
      takeT(1),
      mapT(([script]) => isArray(script) ? script : [script])
    )

    // step2: load scripts
    const scriptLoaderD = Data.empty()
    binaryTweenPipeAtom(scriptsToBeLoadD, scriptLoaderD)

    // step3: extract scripts loaded
    const scriptsLoadedD = Data.empty()
    const scriptsRD = combineLatestT([scriptsToBeLoadD, scriptsLoadedD]).pipe(
      filterT(([options, loaded]) => {
        const { external } = loaded
        return options.every(item => {
          if (!isString(item) && !isObject(item)) {
            throw (new TypeError(`"item" is expected to be type of String | Object, but received "${typeof item}".`))
          }
          const src = isString(item) ? item : item.src
          if (src === undefined) {
            throw (new TypeError('"src" field of item is expected to be type of String, but received "undefined".'))
          }

          return external.some(i => i.src === src)
        })
      }),
      takeT(1),
      mapT(([options, { external }]) => {
        return options.map(i => external.find(j => i.src === j.src))
      }),
      replayWithLatest(1)
    )

    // step4:
    const materialsRD = replayWithLatest(1, combineLatestT({ container: containerRD, scripts: scriptsRD }))

    return {
      inputs: {
        styles: {
          rootClasses: rootClassesRD,
          content: contentRD
        },
        actuations: {
          start: startRD,
          script: scriptRD,
          scriptsLoaded: scriptsLoadedD
        }
      },
      _internals: {
        marks: {
          id: idRD
        },
        styles: {
          rootClasses: rootClassesRD,
          content: contentRD
        }
      },
      outputs: {
        id: idRD,
        container: containerRD,
        scripts: scriptsRD,
        materials: materialsRD,
        scriptLoader: scriptLoaderD
      }
    }
  },
  prepareTemplate: ({ marks, styles, actuations, configs }, template, mutation, { html }) => {
    const { id } = marks
    const { rootClasses, content } = styles

    return html`
      <div id=${id} class=${rootClasses}>${content === undefined ? 'Awesome autonomy app!' : content}</div>
    `
  }
})

export const useAutonomyAppDC = looseCurryN(2, (driverOptions, interfaces) => {
  const res = useUIDriver(autonomyAppDC, driverOptions, interfaces)
  const { template, container } = res.outputs
  res.outputs.app = replayWithLatest(1, startWithT(template, container))
  return res
})
