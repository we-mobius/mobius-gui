import { html } from '../libs/lit-html.js'
import { makeElementMaker } from '../helpers/index.js'

export const makeTableE = makeElementMaker({
  marks: { },
  styles: {
    data: [
      ['name', 'chinese', 'math', 'english'],
      ['cigaret', '90', '90', '90']
    ]
  },
  actuations: { },
  configs: { },
  handler: (view, { styles, utils: { prefix } }) => {
    const { data } = styles

    const createTable = data => data.reduce((rows, rowData) => {
      rows.push(
        html`
          <div class='mobius-layout__horizontal'>
            ${rowData.reduce((row, value) => {
              row.push(html`<div class='mobius-flex-grow--1'>${value}</div>`)
              return row
            }, [])}
          </div>
        `
      )
      return rows
    }, [])

    return view`${createTable(data)}`
  }
})
