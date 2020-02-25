import run from "@cycle/rxjs-run";
import { makeDOMDriver, div } from "@cycle/dom";
import { from } from "rxjs";
import { map } from "rxjs/operators";

function main(sources) {
  let sinks = {
    DOM: from([1, 2, 3]).pipe(
      map(() => {
        return div(".w-full.box-border.flex.p-16", {},
          [1, 2, 3, 4 ].map(index => div(".mobius-flat.p-8.m-8", {}, `${index} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt nesciunt numquam
        iusto rerum minus quisquam, eum labore, rem delectus aliquid enim! Sint dignissimos quasi necessitatibus laboriosam a ex
        architecto. Adipisci.`))
        )
      })
    )
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver("#app")
};

run(main, drivers)
