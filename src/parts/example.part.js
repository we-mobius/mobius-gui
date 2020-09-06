import { makeBasePart } from '../common/index.js'
import { makeTabbarC } from '../components/tabbar.component.js'
import { makeRouterDriver } from '../drivers/router.driver.js'

const makeBottomTabbarP = ({ source }) => {
  return makeBasePart({
    name: 'bottom-tabbar',
    source: source,
    componentMaker: ({ unique }) => {
      return makeTabbarC({
        unique: unique,
        children: [],
        componentToDriverMapper: () => {},
        driver: makeRouterDriver(),
        driverToComponentMapper: () => {},
        config: {}
      })
    }
  })
}

export { makeBottomTabbarP }
