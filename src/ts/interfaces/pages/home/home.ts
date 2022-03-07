import { makeInstantComponent } from 'Helpers/component'

import { appNameRD } from 'Interfaces/page-services/app-route'

export const homeRD = makeInstantComponent(
  [appNameRD],
  ([appName], template, mutation, { html }) => {
    return html`
      <div class="mobius-size--fullpct mobius-padding--r-xl mobius-layout__vertical mobius-shadow--inset mobius-select--text">
        <div class="mobius-text--4sl mobius-font--mono">Mobius GUI</div>
      </div>
    `
  }
)
