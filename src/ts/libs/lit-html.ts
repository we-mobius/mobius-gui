import { directive, NodePart } from 'lit-html'

import type { Part } from 'lit-html'

export * from 'lit-html'

/**
 * export build-in driectives
 * @refer: https://lit.dev/docs/templates/directives/
 */

export { classMap } from 'lit-html/directives/class-map.js'
export { styleMap } from 'lit-html/directives/style-map.js'

export { repeat } from 'lit-html/directives/repeat.js'
export { templateContent } from 'lit-html/directives/template-content.js'
export { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
export { unsafeSVG } from 'lit-html/directives/unsafe-svg.js'

export { cache } from 'lit-html/directives/cache.js'
export { guard } from 'lit-html/directives/guard.js'
export { ifDefined } from 'lit-html/directives/if-defined.js'
export { live } from 'lit-html/directives/live.js'

// export { ref } from 'lit-html/directives/ref.js'

export { until } from 'lit-html/directives/until.js'
export { asyncAppend } from 'lit-html/directives/async-append.js'
export { asyncReplace } from 'lit-html/directives/async-replace.js'

export const notifyWhenRerender = directive((eventHandler, value) => (part: Part) => {
  // ref: https://github.com/Polymer/lit-html/blob/e66eb66/src/lib/parts.ts
  if (!(part instanceof NodePart)) {
    throw (new TypeError('"observed" directive can only used for NodePart.'))
  }

  part.setValue(value)
  eventHandler(value)
})
