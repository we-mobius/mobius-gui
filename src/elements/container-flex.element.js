import { div } from '@cycle/dom'
import { hardDeepMerge } from '../libs/mobius.js'
import { neatenChildren } from '../common/index.js'

const presetSelector = preset => {
  const presets = {
    horizontal: '.mobius-layout__horizontal',
    vertical: '.mobius-layout__vertical'
  }
  return presets[preset] || ''
}

const makeFlexContainerE = ({
  unique, selector = '', props = {}, children = undefined, text = undefined, config = {
    preset: ''
  }
}) => {
  const { preset } = config
  return div(
    `${selector}${presetSelector(preset)}`,
    hardDeepMerge(props, {
      style: { display: 'flex' },
      dataset: { unique }
    }),
    [...neatenChildren(children)]
  )
}

export { makeFlexContainerE }
