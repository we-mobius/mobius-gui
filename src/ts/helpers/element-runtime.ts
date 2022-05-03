import type { NonUndefinedable } from 'MobiusUtils'
import type { ElementOptions } from './element'

/**
 * Runtime 实例化的时候拿到的参数是 ElementMaker Template preparer 收到的已经被填充的 marks、styles、actuations、configs。
 * 即它们必然 Non undefined，且所有的字段都是已填充的。
 */
export interface ElementRuntimeOptions<Options extends ElementOptions> {
  marks: Required<NonUndefinedable<Options['marks']>>
  styles: Required<NonUndefinedable<Options['styles']>>
  actuations: Required<NonUndefinedable<Options['actuations']>>
  configs: Required<NonUndefinedable<Options['configs']>>
}

export abstract class ElementBaseRuntime<Options extends ElementOptions> {
  marks: ElementRuntimeOptions<Options>['marks']
  styles: ElementRuntimeOptions<Options>['styles']
  actuations: ElementRuntimeOptions<Options>['actuations']
  configs: ElementRuntimeOptions<Options>['configs']

  constructor (options: ElementRuntimeOptions<Options>) {
    this.marks = options.marks
    this.styles = options.styles
    this.actuations = options.actuations
    this.configs = options.configs
  }
}
