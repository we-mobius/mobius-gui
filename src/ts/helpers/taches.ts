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
export const idToElementT = (interval: number, target: AtomLikeOfOutput<string>): Data<Element> => {
  return effectT((emit, selector: string) => {
    pollingToGetElement(selector, interval, (node: Element): void => {
      emit(node)
    })
  }, target)
}

/**
 * @see {@link idToElementT}
 */
export const idToElementT_ = curryN(2, idToElementT)
