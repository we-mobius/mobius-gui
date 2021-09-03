import { html } from '../libs/lit-html'
import { makeElementMaker } from '../helpers/index'

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

    const createTable = data => {
      const tableWrapper = table => html`<table class='mobius-table--collapse'>${table}</table>`
      const headWrapper = head => html`<thead>${head}</thead>`
      const bodyWrapper = body => html`<tbody>${body}</tbody>`
      const normalRowWrapper = row => html`<tr>${row}</tr>`
      const headCellWrapper = value => html`<th class='mobius-padding-x--base mobius-padding-y--xs mobius-border--all'>${value}</th>`
      const bodyCellWrapper = value => html`<td class='mobius-padding-x--base mobius-padding-y--xs mobius-border--all'>${value}</td>`

      const head = headWrapper(normalRowWrapper(
        data.shift().reduce((cells, value) => {
          cells.push(headCellWrapper(value))
          return cells
        }, [])
      ))
      const body = bodyWrapper(
        data.reduce((rows, rowData) => {
          rows.push(normalRowWrapper(
            rowData.reduce((row, value) => {
              row.push(bodyCellWrapper(value))
              return row
            }, [])
          ))
          return rows
        }, [])
      )
      const table = tableWrapper([head, body])

      return table
    }

    return view`${createTable(data)}`
  }
})
