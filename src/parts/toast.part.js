import { makeBasePart } from '../common/index.js'
import { makeToastC } from '../components/toast.component.js'
import { toastDriverManager } from '../drivers/toast.driver.js'
import { asIs } from '../libs/mobius-utils.js'

export const makeToastP = ({ source, scope }) => {
  return makeBasePart({
    name: 'toast',
    source: source,
    componentMaker: ({ unique }) => {
      return makeToastC({
        unique: unique,
        children: null,
        componentToDriverMapper: asIs,
        driver: toastDriverManager.scope(scope).driver,
        driverToComponentMapper: asIs,
        config: {}
      })
    }
  })
}
