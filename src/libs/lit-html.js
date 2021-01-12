import { directive, NodePart } from 'lit-html'
export * from 'lit-html'

export const notifyWhenRerender = directive((eventHandler, value) => part => {
  // ref: https://github.com/Polymer/lit-html/blob/e66eb66/src/lib/parts.ts
  if (!(part instanceof NodePart)) {
    throw (new TypeError('"observed" directive can only used for NodePart.'))
  }

  part.setValue(value)
  eventHandler(value)
})
