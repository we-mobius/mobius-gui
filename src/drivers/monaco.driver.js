import { stdLineLog, debounce } from '../libs/mobius-utils.js'
import { makeBaseDriverMaker, equiped } from '../common/index.js'
import {
  loaderObservers, loaderObservables, LOADER_TYPE,
  dredge, ofType, withResponseFilter, makeBaseScopeManager
} from '../libs/mobius-js.js'
import { Subject, startWith, shareReplay } from '../libs/rx.js'

const initMonaco = () => {
  return new Promise((resolve, reject) => {
    window.MonacoEnvironment = {
      getWorkerUrl: () => {
        return URL.createObjectURL(new Blob([`
          self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
          };
          importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
        `], { type: 'text/javascript' })
        )
      }
    }
    const { require } = window
    require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } })
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

export const makeMonacoDriver = ({ clickToLoad } = {}) => {
  const monacoLoaderSrc = 'https://unpkg.com/monaco-editor@latest/min/vs/loader.js'
  dredge(loaderObservables, equiped(
    ofType(LOADER_TYPE.js),
    withResponseFilter('success')
  ))
    .subscribe(({ data: { collection } }) => {
      const newcomeScripts = collection.newcome || []
      const hasMonacoLoader = newcomeScripts.some(script => script.src === monacoLoaderSrc)
      if (hasMonacoLoader) {
        console.warn('monaco loader script loaded', newcomeScripts)
        initMonaco().then(initializer => {
          _eventOutMid$.next({ initializer })
        })
      }
    })
  // NOTE: 未开启 'clickToLoad' 选项的时候，自动加载 monaco loader
  if (!clickToLoad) {
    ofType(LOADER_TYPE.js, loaderObservers).next({ src: monacoLoaderSrc, group: 'monaco' })
  }

  const _editorOutMid$ = new Subject()
  const editorOut$ = _editorOutMid$
  const editorOutShare$ = editorOut$.pipe(shareReplay(1))
  console.log(stdLineLog('MonacoDriver', 'makeMonacoDriver', 'subscribe to editorOutShare$ to initialize'))
  editorOutShare$.subscribe(editor => {
    console.log(stdLineLog('MonacoDriver', 'makeMonacoDriver', 'initializition of editorOutShare$ receives'), editor)
  })

  const eventIn$ = {
    next: detail => {
      const { eventType } = detail
      if (eventType === 'load') {
        if (clickToLoad) {
          ofType(LOADER_TYPE.js, loaderObservers).next({ src: monacoLoaderSrc, group: 'monaco' })
        }
      }
      if (eventType === 'instantialized') {
        const { instance: editor } = detail
        _editorOutMid$.next(editor)
        addEventListener('resize', debounce((e) => {
          editor.layout()
        }, 50))
      }
    },
    error: () => {},
    complete: () => {}
  }
  const _eventOutMid$ = new Subject()
  const eventOut$ = _eventOutMid$.pipe(startWith({ initializer: null }))

  const eventOutShare$ = eventOut$.pipe(shareReplay(1))

  const observers = {
    event: eventIn$
    // main: $,
  }
  const observables = {
    event: eventOutShare$,
    editor: editorOutShare$
    // main: $,
  }
  const eventDriverMaker = makeBaseDriverMaker(
    () => ofType('event', observers),
    () => ofType('event', observables)
  )
  const editorDriverMaker = makeBaseDriverMaker(
    () => {},
    () => ofType('editor', observables)
  )
  return {
    observers: observers,
    observables: observables,
    maker: {
      event: eventDriverMaker,
      editor: editorDriverMaker
    },
    driver: {
      event: eventDriverMaker(),
      editor: editorDriverMaker()
    }
  }
}

// export const monacoDriverManager = makeBaseScopeManager({ maker: makeMonacoDriver })
// monacoDriverManager.registerScope('app', makeMonacoDriver())
