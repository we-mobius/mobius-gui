import { makeElementMaker } from '../helpers/element'

// TODO: 完善
export const makeTipE = makeElementMaker({
  mark: {},
  styles: {},
  actuations: {},
  configs: {},
  handler: (view, { marks, styles, actuations, configs, utils: { html } }) => {
    return html`
      <div class='mobius-padding--base'>
        <div class='mobius-padding--small mobius-rounded--full mobius-bg--base mobius-text--red mobius-text--small mobius-cursor--pointer'>
          <span class='mobius-icon matrix-icon-error mobius-padding-right--xs'></span>
          这是一条提示信息
        </div>
      </div>
    `
  }
})
