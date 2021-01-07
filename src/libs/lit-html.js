import { directive, NodePart } from 'lit-html'
import { isData, isMutation } from './mobius-utils.js'
export * from 'lit-html'

export const notifyWhenRerender = directive((atom, value) => part => {
  // ref: https://github.com/Polymer/lit-html/blob/e66eb66/src/lib/parts.ts
  if (!(part instanceof NodePart)) {
    throw (new TypeError('"observed" directive can only used for NodePart.'))
  }

  part.setValue(value)
  if (isData(atom)) {
    atom.triggerValue(value)
  } else if (isMutation(atom)) {
    atom.triggerMutation(() => value)
  } else {
    throw (new TypeError('"notifyWhenRerender" directive can only receive atom as first arg, i.e. Data | Mutation.'))
  }
})
