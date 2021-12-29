import {
  curryN,
  pollingToGetElement,
  effectT
} from '../libs/mobius-utils'

import type {
  AtomLikeOfOutput, Data
} from '../libs/mobius-utils'

/**
 * @param interval polling interval in milliseconds, default to 100ms
 */
export const idToElementT = <E extends Element = Element>(interval: number, target: AtomLikeOfOutput<string>): Data<E> => {
  return effectT((emit, selector: string) => {
    pollingToGetElement(selector, interval, (node: Element): void => {
      emit(node as E)
    })
  }, target)
}

export interface IdToElementT_ {
  <E extends Element = Element>(interval: number, target: AtomLikeOfOutput<string>): Data<E>
  (interval: number): <E extends Element = Element>(target: AtomLikeOfOutput<string>) => Data<E>
}
/**
 * @see {@link idToElementT}
 */
export const idToElementT_: IdToElementT_ = curryN(2, idToElementT)
