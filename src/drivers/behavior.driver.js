import { makeBaseScopeManager } from '../libs/mobius-js.js'
import {
  TERMINATOR,
  Data, Mutation,
  pipeAtom
} from '../libs/mobius-utils.js'

export const makeBehaviorDriver = () => {
  // control space for page down behavior
  const spaceKeydownListenerD = Data.empty()
  const disableSpaceM = Mutation.ofLiftRight((_, listener) => {
    if (listener) return TERMINATOR
    const disable = e => {
      if (e.code === 'Space') {
        e.returnValue = false
        return false
      }
    }
    document.addEventListener('keydown', disable)
    return disable
  })
  const enableSpaceM = Mutation.ofLiftRight((_, listener) => {
    if (listener) {
      document.removeEventListener('keydown', listener)
    }
    return undefined
  })
  pipeAtom(disableSpaceM, spaceKeydownListenerD)
  pipeAtom(enableSpaceM, spaceKeydownListenerD)

  // control F5 for page refresh behavior
  const f5KeydownListenerD = Data.empty()
  const disableF5RefreshM = Mutation.ofLiftRight((_, listener) => {
    if (listener) return TERMINATOR
    const disable = e => {
      if (e.code === 'F5') {
        e.returnValue = false
        return false
      }
    }
    document.addEventListener('keydown', disable)
    return disable
  })
  const enableF5RefreshM = Mutation.ofLiftRight((_, listener) => {
    if (listener) {
      document.removeEventListener('keydown', listener)
    }
    return false
  })
  pipeAtom(disableF5RefreshM, f5KeydownListenerD)
  pipeAtom(enableF5RefreshM, f5KeydownListenerD)

  // control `Ctrl + R` for page refresh behavior
  const ctrlRKeydownListenerD = Data.empty()
  const disableCtrlRRefreshM = Mutation.ofLiftRight((_, listener) => {
    if (listener) return TERMINATOR
    const disable = e => {
      if (e.ctrlKey && e.code === 'KeyR') {
        e.returnValue = false
        return false
      }
    }
    document.addEventListener('keydown', disable)
    return disable
  })
  const enableCtrlRRefreshM = Mutation.ofLiftRight((_, listener) => {
    if (listener) {
      document.removeEventListener('keydown', listener)
    }
    return false
  })
  pipeAtom(disableCtrlRRefreshM, ctrlRKeydownListenerD)
  pipeAtom(enableCtrlRRefreshM, ctrlRKeydownListenerD)

  return {
    enableSpaceM,
    disableSpaceM,
    enableF5RefreshM,
    disableF5RefreshM,
    enableCtrlRRefreshM,
    disableCtrlRRefreshM
  }
}

export const behaviorDriverManager = makeBaseScopeManager({ maker: makeBehaviorDriver })
