import { makeBasePart } from '../common/index.js'
import { makeTabbarC } from '../components/tabbar.component.js'
import { routerDriverManager } from '../drivers/router.driver.js'

const makeBottomTabbarP = ({ source, list }) => {
  return makeBasePart({
    name: 'bottom-tabbar',
    source: source,
    componentMaker: ({ unique }) => {
      return makeTabbarC({
        unique: unique,
        children: null,
        componentToDriverMapper: e => {
          if (e.target.dataset.path) {
            return { type: 'set', path: e.target.dataset.path }
          } else {
            return {}
          }
        },
        driver: routerDriverManager.scope('app').driver,
        driverToComponentMapper: path => {
          // TODO: smarter path equation determining
          //   -> '/board/' == '/board'
          return {
            list: list.map(item => {
              return { ...item, selected: path === item.dataset.path }
            })
          }
        },
        config: {}
      })
    }
  })
}

export { makeBottomTabbarP }
