# Design Specification

## Priciple

1. Only things that can interact directly can apply the terrace style.
2. Overriding Themes & Shadow Style & Shadow Direction(Light Source Dir.) on descendants by use corresponding css classes only when follow the princple that all of them are not designed to be overrided more than twice(or nested more than twice). Otherwise there will come with unexpected appearance.
3. Putting single element of A theme in the ground of theme B is not suggested.
4. Changing background color to mark the elements' or components' status is not suggested.

## StyleSheet

All of the style divided into 6 categories in terms of its special function in UI build processes:

- variables
- base
- utilities
  - Theme: mobius-theme-dark, mobius-theme-light,
  - Text: mobius-text-normal, mobius-text-primary,
          mobius-text-light, mobius-text-dark, mobius-text-cigaret, mobius-text-mobius,
  - Background: mobius-bg-transparent,
                mobius-bg-concave, mobius-bg-convex,
                mobius-bg-normal, mobius-bg-primary,
                mobius-bg-light, mobius-bg-dark, mobius-bg-cigaret, mobius-bg-mobius,
  - Shadow: mobius-shadow-normal, mobius-shadow-inset,
            mobius-shadow-half, mobius-shadow-thin,
            mobius-shadow-lt2rb, mobius-shadow-rt2lb, mobius-shadow-rb2lt, mobius-shadow-lb2rt,
  - Border: mobius-border-top, mobius-border-right, mobius-border-bottom, mobius-border-left,
            mobius-border-x, mobius-border-y, mobius-border-all,
            mobius-border-thin, mobius-border-thick,
            mobius-border-none, mobius-border-hidden,
            mobius-border-dotted, mobius-border-dashed, mobius-border-solid, mobius-border-double,
            mobius-border-light, mobius-border-dark, mobius-border-cigaret, mobius-border-mobius,
  - ScrollBar: mobius-scrollbar-hidden,
  - Transition: mobius-transition-all, mobius-transition-normal
- elements
  - Icon: mobius-icon,
          mobius-icon-light-lt2rb, mobius-icon-light-rt2lb, mobius-icon-light-rb2lt, mobius-icon-light-lb2rt
- components
  - Toggle: mobius-toggle, mobius-toggle-checked(with specific dom structure)
- layouts
  - mobius-layout-portal
