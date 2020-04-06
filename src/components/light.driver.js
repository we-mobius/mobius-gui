import { adapt } from '@cycle/run/lib/adapt'
import { Observable } from 'rxjs'
import { setLightsource, Light } from '../services/theme.service'

function makeLightDriver () {
  function lightDriver (message$) {
    message$.addListener({
      next: dir => {
        setLightsource(dir)
      },
      error: () => {},
      complete: () => {}
    })

    const props$ = Observable.create(function (observer) {
      Light.listen(function (data) {
        observer.next(data)
      })
    })
    return adapt(props$)
  }
  return lightDriver
}

export default makeLightDriver

export { makeLightDriver }
