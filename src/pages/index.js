import run from '@cycle/rxjs-run'
import { makeDOMDriver, div, img } from '@cycle/dom'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

function main (sources) {
  const sinks = {
    DOM: from([1, 2, 3]).pipe(
      map(() => {
        return div('.w-full.box-border.flex.p-16', {}, [
          ...[1, 2, 3, 4].map(index =>
            div(
              '.mobius-flat.p-8.m-8',
              {},
              `${index} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt nesciunt numquam iusto rerum minus quisquam, eum labore, rem delectus aliquid enim! Sint dignissimos quasi necessitatibus laboriosam a exarchitecto. Adipisci.
              `
            )
          ),
          img('.img', {
            attrs: {
              src: 'https://gitee.com/shidenggui/assets/raw/master/uPic/RrpwmE.png',
              width: '300px'
            }
          })
        ])
      })
    )
  }
  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
