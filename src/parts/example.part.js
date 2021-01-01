import { makeBasePart } from '../common/index.js'
import { makeTabbarC } from '../components/tabbar.component.js'
import { makeRouterDriver } from '../drivers/router.driver.js'
import { asIs } from '../libs/mobius-utils.js'

export const makeBottomTabbarP = ({ source }) => {
  return makeBasePart({
    name: 'bottom-tabbar',
    source: source,
    componentMaker: ({ unique }) => {
      return makeTabbarC({
        unique: unique,
        children: null,
        componentToDriverMapper: asIs,
        driver: makeRouterDriver(),
        driverToComponentMapper: asIs,
        config: {}
      })
    }
  })
}
