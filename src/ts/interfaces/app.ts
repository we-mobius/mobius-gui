import { replayWithLatest, Data } from '../libs/mobius-utils'
import { html } from '../../main'

export const appTemplateRD = replayWithLatest(1, Data.of(html`
  <div>Welcome to use Mobius GUI.</div>
`))
