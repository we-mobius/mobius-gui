
import { div, span } from '@cycle/dom'

const joinify = (reg) => (strings) => `${strings}`.replace(reg, '')
const joinifyClasses = joinify(/(\r\n|\n|\s)/g)
const joinifyString = joinify(/(\r\n|\n)/g)

const LOREM = joinifyString`
  Lorem, ipsum dolor sit amet neasd consectetur adipisicing elit.
  Explicabo dicta reiciendis blanditiis tempora ipsum consequatur reprehenderit temporibus nisi culpa voluptatem,
  unde dolores esse incidunt minima quos repellendus? Beatae, molestiae sunt.
`

const section = (innerBlock) =>
  div('.mobius-margin--base.mobius-margin-top--none', innerBlock || [])
const sectionFull = (innerBlock) =>
  div('.mobius-flex-item--stretch.mobius-margin--base.mobius-margin-top--none', innerBlock || [])

const title = (content) =>
  div(
    joinifyClasses`
      .mobius-layout__horizontal.mobius-flex-justify--center
      .mobius-margin-top--base
      .mobius-text-leading--xl.mobius-text--sl.mobius-font--fantasy
    `,
    [
      span(content)
    ]
  )

const paragraph = (fontFamily) =>
  div(`.mobius-padding--base.mobius-text--justify${fontFamily}`, LOREM + LOREM)

const zuma = (innerBlock) =>
  div('.mobius-layout__horizontal.mobius-flex-justify--between', innerBlock || [])
const zumaCenter = (innerBlock) =>
  div('.mobius-layout__horizontal.mobius-flex-justify--center', innerBlock || [])

const terrace = (content) =>
  div(
    joinifyClasses`
      .mobius-width--25vw.mobius-flex-grow--1
      .mobius-padding--base.mobius-margin--large
      .mobius-shadow--normal.mobius-rounded--xs
      .hover_mobius-shadow--inset.hover_mobius-text--primary
      .mobius-text--justify
      .mobius-cursor--pointer
    `,
    {
      style: {
        'min-width': 'min-content'
      }
    },
    [content]
  )

const card = (content) =>
  div('.mobius-width--30.mobius-flex-grow--1.mobius-padding--base.mobius-margin--large', [content])

const footer = (innerBlock) =>
  div('.mobius-padding--base.mobius-margin--large.mobius-text--center.mobius-cursor--pointer', innerBlock || [])

const buttonBase = (extraClasses) => {
  const classes = `
      .mobius-flex-basis--auto.mobius-flex-grow--1
      .mobius-padding--base.mobius-margin-y--large.mobius-margin-x--xl
      .mobius-shadow--normal
      .mobius-text--center
      .active_mobius-shadow--thin.hover_mobius-text--primary
      .mobius-cursor--pointer
    ` + extraClasses
  return (content) =>
    div(
      joinifyClasses(classes),
      {
        style: {
          'max-width': '15em'
        }
      },
      [content]
    )
}
const buttonNormal = buttonBase('.mobius-rounded--xs')
const buttonPrimary = buttonBase('.mobius-rounded--xs.mobius-text--primary')
const buttonRoundedNormal = buttonBase('.mobius-rounded--full')
const buttonRoundedPrimary = buttonBase('.mobius-rounded--full.mobius-text--primary')

const buttonBorderTop = buttonBase('.mobius-rounded--xs.mobius-border--top')
const buttonBorderRightPrimary = buttonBase('.mobius-rounded--xs.mobius-border--right.mobius-text--primary')
const buttonRoundedBorderBottom = buttonBase('.mobius-rounded--full.mobius-border--bottom')
const buttonRoundedBorderLeftPrimary = buttonBase('.mobius-rounded--full.mobius-border--left.mobius-text--primary')

const buttonBorderAll = buttonBase('.mobius-rounded--xs.mobius-border--all')
const buttonBorderAllPrimary = buttonBase('.mobius-rounded--xs.mobius-border--all.mobius-text--primary')
const buttonRoundedBorderAll = buttonBase('.mobius-rounded--full.mobius-border--all')
const buttonRoundedBorderAllPrimary = buttonBase('.mobius-rounded--full.mobius-border--all.mobius-text--primary')

const buttonBorderX = buttonBase('.mobius-rounded--xs.mobius-border--x')
const buttonBorderXPrimary = buttonBase('.mobius-rounded--xs.mobius-border--x.mobius-text--primary')
const buttonRoundedBorderX = buttonBase('.mobius-rounded--full.mobius-border--x')
const buttonRoundedBorderXPrimary = buttonBase('.mobius-rounded--full.mobius-border--x.mobius-text--primary')

const buttonBorderY = buttonBase('.mobius-rounded--xs.mobius-border--y')
const buttonBorderYPrimary = buttonBase('.mobius-rounded--xs.mobius-border--y.mobius-text--primary')
const buttonRoundedBorderY = buttonBase('.mobius-rounded--full.mobius-border--y')
const buttonRoundedBorderYPrimary = buttonBase('.mobius-rounded--full.mobius-border--y.mobius-text--primary')

const mockButtonGroup = [
  buttonNormal('Mock Normal Button'),
  buttonPrimary('Mock Primary Button'),
  buttonRoundedNormal('Mock Normal Button'),
  buttonRoundedPrimary('Mock Primary Button')
]

const mockButtonGroupSingle = [
  buttonBorderTop('Mock Normal Button'),
  buttonBorderRightPrimary('Mock Primary Button'),
  buttonRoundedBorderBottom('Mock Normal Button'),
  buttonRoundedBorderLeftPrimary('Mock Primary Button')
]

const mockButtonGroupBorderX = [
  buttonBorderX('Mock Normal Button'),
  buttonBorderXPrimary('Mock Primary Button'),
  buttonRoundedBorderX('Mock Normal Button'),
  buttonRoundedBorderXPrimary('Mock Primary Button')
]

const mockButtonGroupBorderY = [buttonBorderY('Mock Normal Button'),
  buttonBorderYPrimary('Mock Primary Button'),
  buttonRoundedBorderY('Mock Normal Button'),
  buttonRoundedBorderYPrimary('Mock Primary Button')
]

const mockButtonGroupBorderAll = [
  buttonBorderAll('Mock Normal Button'),
  buttonBorderAllPrimary('Mock Primary Button'),
  buttonRoundedBorderAll('Mock Normal Button'),
  buttonRoundedBorderAllPrimary('Mock Primary Button')
]

export {
  section, sectionFull, zuma, zumaCenter, terrace,
  title, paragraph, card, footer,
  mockButtonGroup, mockButtonGroupSingle, mockButtonGroupBorderX, mockButtonGroupBorderY, mockButtonGroupBorderAll
}
