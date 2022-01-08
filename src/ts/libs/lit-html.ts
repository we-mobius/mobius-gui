// basics
export { html, svg, render, nothing, noChange } from 'lit-html'
export type { RenderOptions, TemplateResult, HTMLTemplateResult, SVGTemplateResult } from 'lit-html'

/**
 * @refer https://lit.dev/docs/templates/expressions/#static-expressions
 */
export * as StaticHTML from 'lit-html/static.js'

/**
 * export build-in driectives
 * @refer: https://lit.dev/docs/templates/directives/
 */

// styling
export { classMap } from 'lit-html/directives/class-map.js'
export { styleMap } from 'lit-html/directives/style-map.js'

// loops and conditionals
export { when } from 'lit-html/directives/when.js'
export { choose } from 'lit-html/directives/choose.js'
export { map } from 'lit-html/directives/map.js'
export { repeat } from 'lit-html/directives/repeat.js'
export { join } from 'lit-html/directives/join.js'
export { range } from 'lit-html/directives/range.js'
export { ifDefined } from 'lit-html/directives/if-defined.js'

// caching and change detection
export { cache } from 'lit-html/directives/cache.js'
export { guard } from 'lit-html/directives/guard.js'
export { live } from 'lit-html/directives/live.js'

// referencing rendered DOM
export { ref } from 'lit-html/directives/ref.js'

// rendering special values
export { templateContent } from 'lit-html/directives/template-content.js'
export { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
export { unsafeSVG } from 'lit-html/directives/unsafe-svg.js'

// asynchronous rendering
export { until } from 'lit-html/directives/until.js'
export { asyncAppend } from 'lit-html/directives/async-append.js'
export { asyncReplace } from 'lit-html/directives/async-replace.js'
