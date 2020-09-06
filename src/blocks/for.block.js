import { asIs } from '../libs/mobius.js'

const makeForB = ({ unique = '', config = {} }) => {
  const { data = [], mapper = asIs, target } = config
  return data.length === 0 ? [] : data.map(mapper).map(target)
}

export { makeForB }
