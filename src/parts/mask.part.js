import { makeMaskC } from '../components/mask.component.js'
import { maskDriverManager } from '../drivers/mask.driver.js'
import { makeBasePart } from '../common/index.js'
import { asIs } from '../libs/mobius-utils.js'

const makeMaskP = ({ source, scope }) => {
  return makeBasePart({
    name: 'mask',
    source: source,
    componentMaker: ({ unique }) => makeMaskC({
      unique: unique,
      children: null,
      componentToDriverMapper: asIs,
      driver: maskDriverManager.scope(scope).driver,
      driverToComponentMapper: asIs,
      config: {}
    })
  })
}

export { makeMaskP }
