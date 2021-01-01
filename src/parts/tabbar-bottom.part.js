import { makeBasePart } from '../common/index.js'
import { makeTabbarC } from '../components/tabbar.component.js'
import { routerDriverManager } from '../drivers/router.driver.js'
import { isPathnameLooseEqual } from '../libs/mobius-utils.js'

const makeBottomTabbarP = ({ source, list }) => {
  return makeBasePart({
    name: 'bottom-tabbar',
    source: source,
    componentMaker: ({ unique }) => {
      return makeTabbarC({
        unique: unique,
        children: null,
        componentToDriverMapper: e => {
          const { pathname } = e.target.dataset
          return pathname ? { type: 'set', pathname } : {}
        },
        driver: routerDriverManager.scope('app').driver,
        driverToComponentMapper: pathname => {
          // NOTE: isPathnameLooseEqual -> '/board/' equals '/board'
          return {
            list: list.map(item => {
              return { ...item, selected: isPathnameLooseEqual(pathname, item.dataset.pathname) }
            })
          }
        },
        config: {}
      })
    }
  })
}

export { makeBottomTabbarP }
