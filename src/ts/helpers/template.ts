
export interface MSATemplate {
  getHTML: () => string
}

export const template = (strings: TemplateStringsArray, ...values: any[]): MSATemplate => {
  let html = ''
  for (let i = 0, len = strings.length; i < len; i++) {
    html += strings[i]
    html = `${html}${String(values[i] ?? '')}`
  }
  return {
    getHTML: () => html
  }
}
