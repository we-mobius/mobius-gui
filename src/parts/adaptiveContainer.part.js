import { makeBasePart } from '../common/index.js'
import { makeContainerC } from '../components/container.component.js'
import { makeAdaptiveDriver } from '../drivers/adaptive.driver.js'

const makeAdaptiveContainerP = ({ source, conditions, children }) => {
  return makeBasePart({
    name: 'adaptive-container',
    source: source,
    componentMaker: ({ unique }) => {
      return makeContainerC({
        unique: unique,
        children: children,
        componentToDriverMapper: () => {},
        driver: makeAdaptiveDriver(),
        driverToComponentMapper: (vars) => {
          const isShow = Object.keys(conditions).every(key => {
            return conditions[key](vars[key])
          })
          return { isShow }
        }
      })
    }
  })
}

export { makeAdaptiveContainerP }
