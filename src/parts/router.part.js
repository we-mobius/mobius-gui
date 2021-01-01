import { makeSimplePart } from '../common/index.js'
import { makeRouterC } from '../components/router.component.js'
import { routerDriverManager } from '../drivers/router.driver.js'

const makeRouterP = ({ source, children, config }) => {
  const { depth = 1 } = config
  return makeSimplePart({
    name: 'router',
    source: source,
    componentMaker: ({ unique }) => {
      return makeRouterC({
        unique: unique,
        children: children,
        componentToDriverMapper: () => {},
        driver: routerDriverManager.scope('app').driver,
        driverToComponentMapper: path => {
          const pathname = path.split('/')[depth] || 'index'
          const condition = children[pathname] ? pathname : '404'
          return {
            condition: condition
          }
        },
        config: {
          ...config
        }
      })
    }
  })
}

export { makeRouterP }
