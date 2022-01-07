export interface ComponentCommonOptions {
  /**
   * @default true
   */
  enableAsync?: boolean
  /**
   * Whether the generated Atom is relayable (for one).
   *
   * @default true
   */
  enableReplay?: boolean
  /**
   * When set to true, the component will use `nothing` as default value in avoid of
   * stucking the whole application when sources are not ready.
   *
   * @default true
   */
  enableOutlier?: boolean
}

export const DEFAULT_COMPONENT_COMMON_OPTIONS: Required<ComponentCommonOptions> = {
  enableAsync: true,
  enableReplay: true,
  enableOutlier: true
}
