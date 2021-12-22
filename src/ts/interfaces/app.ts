import { replayWithLatest, Data } from '../libs/mobius-utils'
import { html } from '../../main'

// export const appTemplateRD = makeComponentWithReplay(
//   [],
//   () => {
//     console.log('[appTemplateRD]')
//     return html`
//       <div>Welcome to use Mobius Template.</div>
//     `
//   }
// )

export const appTemplateRD = replayWithLatest(1, Data.of(html`
  <div>Welcome to use Mobius UI.</div>
`))
