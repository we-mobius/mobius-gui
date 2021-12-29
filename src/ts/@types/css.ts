/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace CSS {
    interface PropertyDefinition {
      name: string
      syntax?: string
      inherits: boolean
      initialValue?: string
    }
    function registerProperty (propertyDefinition: PropertyDefinition): undefined
  }
}

export { }
