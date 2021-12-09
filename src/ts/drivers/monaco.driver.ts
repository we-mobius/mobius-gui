import {
  debounce, composeL,
  Mutation, Data, TERMINATOR, pipeAtom,
  createMutationFromEvent,
  dataToData, mutationToDataS,
  replayWithLatest,
  combineLatestT, skipUntilT
} from '../libs/mobius-utils'
import {
  loaderObservers, loaderObservables, LOADER_TYPE,
  dredge, ofType, withResponseFilter
} from '../libs/mobius-js'
// https://cdn.jsdelivr.net/npm/
// https://unpkg.com/
const initMonaco = async () => {
  return await new Promise((resolve, reject) => {
    window.MonacoEnvironment = {
      getWorkerUrl: () => {
        return URL.createObjectURL(new Blob([`
          self.MonacoEnvironment = {
            baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/'
          };
          importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs/base/worker/workerMain.js');
        `], { type: 'text/javascript' })
        )
      }
    }
    const { require } = window
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' } })
    require(['vs/editor/editor.main'], () => {
      const { monaco } = window
      const initializer = containerElm => {
        return monaco.editor.create(containerElm, {
          value:
`// Welcome to use Thoughts Bookmarklet!
document.querySelector('.highlight-span').innerHTML = "Welcome Mobius Bookmarklet!"
`,
          language: 'javascript',
          theme: 'vs-dark'
        })
      }
      resolve(initializer)
    })
  })
}

export const makeMonacoDriver = ({ autoLoad, layoutDebounce = 50 } = {}) => {
  const monacoLoaderSrc = 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs/loader.js'
  dredge(loaderObservables, composeL(
    ofType(LOADER_TYPE.js),
    withResponseFilter('success')
  ))
    .subscribe(({ data: { collection } }) => {
      const newcomeScripts = collection.newcome || []
      const hasMonacoLoader = newcomeScripts.some(script => script.src === monacoLoaderSrc)
      if (hasMonacoLoader) {
        console.warn('monaco loader script loaded', newcomeScripts)
        initMonaco().then(initializer => {
          initializerRD.triggerValue(initializer)
          loaderLoadedRD.triggerValue(true)
        })
      }
    })

  /**********************************************
   *        load of monaco editor loader
   **********************************************/
  const loadRD = replayWithLatest(1, Data.of(autoLoad))
  const loadM = Mutation.ofLiftBoth((income, load) => {
    // load of loader should only be triggerd once.
    return load === true ? TERMINATOR : (income || TERMINATOR)
  }) // export
  const loadRM = replayWithLatest(1, loadM)
  pipeAtom(loadRD, loadRM)
  const loadLoaderM = Mutation.of(() => {
    ofType(LOADER_TYPE.js, loaderObservers).next({ src: monacoLoaderSrc, group: 'monaco' })
  })
  // Mutation execute only when it be observed
  pipeAtom(replayWithLatest(1, mutationToDataS(loadRM)), loadLoaderM, Data.empty())
  // load states of monaco loader :: Boolean
  // TODO:
  const loaderLoadedRD = replayWithLatest(1, Data.of(autoLoad)) // export

  /**********************************************
   *      initializition of monaco editor
   **********************************************/
  const initializerRD = replayWithLatest(1, Data.empty())
  const fillContainerM = Mutation.ofLiftLeft(container => container) // export
  const containerRD = replayWithLatest(1, Data.empty())
  pipeAtom(fillContainerM, containerRD)
  const containerAndInitializerD = combineLatestT(containerRD, initializerRD)
  const initializeM = Mutation.ofLiftLeft(([container, initializer]) => {
    const instance = initializer(container)
    return { container, instance }
  })
  const initializedD = Data.empty()
  pipeAtom(containerAndInitializerD, initializeM, initializedD)
  const initializedRD = replayWithLatest(1, initializedD) // export
  const initializedContainerRD = dataToData(({ container }) => container, initializedRD) // export
  const initializedInstanceRD = dataToData(({ instance }) => instance, initializedRD) // export

  /**********************************************
   *      insertion of monaco editor
   **********************************************/
  const insertM = Mutation.of(() => true) // export

  /**********************************************
   * control directives of monaco editor instance
   **********************************************/
  const layoutD = Data.empty()
  const validLayoutD = skipUntilT(initializedInstanceRD, layoutD)
  // !! there is no return value required for layoutM, so debounce is just working here
  const layoutM = Mutation.ofLiftLeft(debounce(() => {
    initializedInstanceRD.value.layout()
  }, layoutDebounce)) // export
  pipeAtom(layoutM, Data.empty())
  pipeAtom(validLayoutD, layoutM)

  // layout monaco editor when it be inserted in the DOM
  pipeAtom(insertM, layoutD)
  const resizeM = createMutationFromEvent({ target: window, type: 'resize', handler: e => () => e })[0]
  // layout monaco editor when the window size change
  pipeAtom(resizeM, layoutD)

  return {
    loadM,
    fillContainerM,
    loaderLoadedRD,
    initializedRD,
    initializedContainerRD,
    initializedInstanceRD,
    insertM,
    layoutM
  }
}
