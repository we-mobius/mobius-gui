import { makeBaseDriverMaker } from '../common/index.js'
import { Subject, shareReplay, startWith, scan, map } from '../libs/rx.js'
import { makeBaseObserver, ofType, makeBaseScopeManager } from '../libs/mobius-js.js'
import { isArray, isObject, hasOwnProperty, reject } from '../libs/mobius-utils.js'

export const makeTagsDriver = config => {
  const { list, mode = 'multi' } = config

  if (mode === 'multi') {
    list.unshift({ text: '全部', value: '_all', selected: list.every(item => item.selected), _runtime: true })
  }

  const tagsIn$ = makeBaseObserver(val => {
    if (isArray(val)) {
      _tagsOutMid$.next(val)
    } else if (isObject(val)) {
      _tagsOutMid$.next([val])
    }
  })
  const _tagsOutMid$ = new Subject()
  const tagsOut$ = _tagsOutMid$.pipe(
    startWith([{}]),
    scan((list, incomes) => {
      incomes.forEach(income => {
        const allSelected = list[0].selected
        list.map(item => {
          if (income.value === '_all') {
            item.selected = !allSelected
          } else if (item.value === income.value) {
            item.selected = hasOwnProperty('selected', income) ? income.selected : !item.selected
          }
          return item
        })
        list[0].selected = list.slice(1).every(item => item.selected)
      })
      return list
    }, list),
    shareReplay(1)
  )
  const tagsConfigOut$ = tagsOut$.pipe(
    map(list => ({ list })),
    shareReplay(1)
  )

  const tags$ = tagsOut$.pipe(
    map(reject(item => item._runtime)),
    shareReplay(1)
  )

  const selectedTags$ = tags$.pipe(
    map(tags => {
      return tags.filter(tag => tag.selected).map(tag => tag.value)
    }),
    shareReplay(1)
  )

  const observers = {
    compConfig: tagsIn$
  }
  const observables = {
    compConfig: tagsConfigOut$,
    tags: tags$,
    selectedTags: selectedTags$
  }

  const compConfigDriverMaker = makeBaseDriverMaker(
    () => ofType('compConfig', observers),
    () => ofType('compConfig', observables)
  )

  const tagsDriverMaker = makeBaseDriverMaker(
    () => {},
    () => ofType('tags', observables)
  )

  const selectedTagsDriverMaker = makeBaseDriverMaker(
    () => {},
    () => ofType('selectedTags', observables)
  )

  return {
    observers: observers,
    observables: observables,
    maker: {
      compConfig: compConfigDriverMaker,
      tags: tagsDriverMaker,
      selectedTags: selectedTagsDriverMaker
    },
    driver: {
      compConfig: compConfigDriverMaker(),
      tags: tagsDriverMaker(),
      selectedTags: selectedTagsDriverMaker()
    }
  }
}

export const tagsDriverManager = makeBaseScopeManager({ maker: makeTagsDriver })
