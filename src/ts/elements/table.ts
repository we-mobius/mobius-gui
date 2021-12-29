import { createElementMaker } from '../helpers/index'
import { html } from '../libs/lit-html'

import type { ElementOptions } from '../helpers/index'
import type { TemplateResult } from '../libs/lit-html'

export type TableElementData = [any[], ...any[][]]

export interface TableElementOptions extends ElementOptions {
  styles?: {
    data?: TableElementData
  }
}

/**
 *
 */
export const makeTableE = createElementMaker<TableElementOptions>({
  marks: {},
  styles: {
    data: [
      ['name', 'chinese', 'math', 'english'],
      ['cigaret', '90', '90', '90']
    ]
  },
  actuations: {},
  configs: {},
  prepareTemplate: (view, { styles }) => {
    const { data } = styles

    const createTable = (data: any[][]): TemplateResult => {
      const tableWrapper = (table: any): TemplateResult => html`<table class='mobius-table--collapse'>${table}</table>`
      const headWrapper = (head: any): TemplateResult => html`<thead>${head}</thead>`
      const bodyWrapper = (body: any): TemplateResult => html`<tbody>${body}</tbody>`
      const normalRowWrapper = (row: any): TemplateResult => html`<tr>${row}</tr>`
      const headCellWrapper = (value: any): TemplateResult => html`<th class='mobius-padding-x--base mobius-padding-y--xs mobius-border--all'>${value}</th>`
      const bodyCellWrapper = (value: any): TemplateResult => html`<td class='mobius-padding-x--base mobius-padding-y--xs mobius-border--all'>${value}</td>`

      const head = headWrapper(normalRowWrapper(
        (data.shift() ?? []).reduce<TemplateResult[]>((cells, value) => {
          cells.push(headCellWrapper(value))
          return cells
        }, [])
      ))
      const body = bodyWrapper(
        data.reduce<TemplateResult[]>((rows, rowData) => {
          rows.push(normalRowWrapper(
            rowData.reduce<TemplateResult[]>((row, value) => {
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
