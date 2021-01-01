import { makeBasePart } from '../common/index.js'
import { makeTagsC } from '../components/tags.component.js'
import { tagsDriverManager } from '../drivers/tags.driver.js'
import { asIs } from '../libs/mobius-utils.js'

export const makeTagsP = ({ source, config: { list = [], driverScopeName } }) => {
  if (!driverScopeName) {
    throw new Error('driverScopeName is required!')
  }
  tagsDriverManager.registerScope(driverScopeName, tagsDriverManager.maker({ list }))
  const tagsDriver = tagsDriverManager.scope(driverScopeName)
  return makeBasePart({
    name: 'tags',
    source: source,
    componentMaker: ({ unique }) => {
      return makeTagsC({
        unique: unique,
        children: null,
        componentToDriverMapper: asIs,
        driver: tagsDriver.driver.compConfig,
        driverToComponentMapper: asIs,
        config: {}
      })
    }
  })
}
