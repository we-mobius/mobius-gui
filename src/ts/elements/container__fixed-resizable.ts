import { createElementMaker } from '../helpers/index'

import type { ClassUnion } from '../libs/mobius-utils'
import type { ElementOptions } from '../helpers/index'

const useCursorStyle = (configs: Required<FixedResizableContainerElementConfigs>, dft: string): string => {
  const { isPrepareToMoving, isMoving } = configs

  return `${!isPrepareToMoving ? dft : ''}` +
  `${isPrepareToMoving && !isMoving ? 'cursor--grab' : ''}` +
  `${isMoving ? 'cursor--grabbing' : ''}`
}
const useShowStyle = (configs: Required<FixedResizableContainerElementConfigs>): string => {
  const { isHandling } = configs
  return `${isHandling ? 'display--block' : 'display--none'}`
}

export interface FixedResizableContainerElementConfigs {
  isHandling?: boolean
  isResizing?: boolean
  isPrepareToMoving?: boolean
  isMoving?: boolean
}

export interface FixedResizableContainerElementOptions extends ElementOptions {
  styles?: {
    'container--outer'?: ClassUnion
    'control-bar--top'?: ClassUnion
    'control-bar--right'?: ClassUnion
    'control-bar--bottom'?: ClassUnion
    'control-bar--left'?: ClassUnion
    'control-bar--left-top'?: ClassUnion
    'control-bar--right-top'?: ClassUnion
    'control-bar--right-bottom'?: ClassUnion
    'control-bar--left-bottom'?: ClassUnion
    'container--inner'?: ClassUnion
    'mask--inner'?: ClassUnion
    'mask--outer'?: ClassUnion
    'bar-weight'?: number
    'position--top'?: number
    'position--right'?: number
    'position--bottom'?: number
    'position--left'?: number
  }
  configs?: FixedResizableContainerElementConfigs
}

/**
 *
 */
export const makeFixedResizableContainerE = createElementMaker<FixedResizableContainerElementOptions>({
  marks: {},
  styles: {
    'container--outer': configs => 'position--fixed ' + `${configs.isHandling ? 'mobius-select--none' : ''}`,
    'control-bar--top': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--t-resize'),
    'control-bar--right': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--r-resize'),
    'control-bar--bottom': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--b-resize'),
    'control-bar--left': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--l-resize'),
    'control-bar--left-top': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--lt-resize'),
    'control-bar--right-top': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--rt-resize'),
    'control-bar--right-bottom': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--rb-resize'),
    'control-bar--left-bottom': configs => 'position--absolute bg--cigaret ' + useCursorStyle(configs, 'cursor--lb-resize'),
    'container--inner': 'position--absolute overflow--hidden',
    'mask--inner': configs => 'position--absolute ' + useShowStyle(configs) + ' ' + useCursorStyle(configs, ''),
    'mask--outer': configs => 'select--none size--fullview position--fixed position--tl ' + useShowStyle(configs) + ' ' + useCursorStyle(configs, ''),
    'bar-weight': 20,
    'position--top': 0,
    'position--right': 0,
    'position--bottom': 0,
    'position--left': 0
  },
  actuations: {},
  configs: {
    isHandling: false,
    isResizing: false,
    isPrepareToMoving: false,
    isMoving: false
  },
  prepareTemplate: view => view`
    <div
      data-name="outer-mask"
      class=${'mask--outer'}
      @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'}
    ></div>
    <div
      id=${'id'}
      style="top: ${'position--top'}px; right: ${'position--right'}px; bottom: ${'position--bottom'}px; left: ${'position--left'}px;"
      class="${'container--outer'}"
    >
      <div
        data-name="top"
        style="left: 0; top: 0px; width: 100%; height: ${'bar-weight'}px;"
        class="${'control-bar--top'}"
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="right"
        style="top: 0px; right: 0; width: ${'bar-weight'}px; height: 100%;"
        class=${'control-bar--right'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="bottom"
        style="right: 0; bottom: 0px; width: 100%; height: ${'bar-weight'}px;"
        class=${'control-bar--bottom'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="left"
        style="bottom: 0px; left: 0; width: ${'bar-weight'}px; height: 100%;"
        class=${'control-bar--left'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="left-top"
        style="left: 0; top: 0px; width: ${'bar-weight'}px; height: ${'bar-weight'}px;"
        class=${'control-bar--left-top'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="right-top"
        style="top: 0px; right: 0; width: ${'bar-weight'}px; height: ${'bar-weight'}px;"
        class=${'control-bar--right-top'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="right-bottom"
        style="right: 0; bottom: 0px; width: ${'bar-weight'}px; height: ${'bar-weight'}px;"
        class=${'control-bar--right-bottom'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        data-name="left-bottom"
        style="bottom: 0px; left: 0; width: ${'bar-weight'}px; height: ${'bar-weight'}px;"
        class=${'control-bar--left-bottom'}
        @mousedown=${'mouseDownHandler'} @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'} @dblclick=${'dbClickHandler'}
      ></div>
      <div
        style="top: ${'bar-weight'}px; right: ${'bar-weight'}px; bottom: ${'bar-weight'}px; left: ${'bar-weight'}px;"
        class=${'container--inner'}
      >
        ${'content'}
      </div>
      <div
        data-name="inner-mask"
        style="top: ${'bar-weight'}px; right: ${'bar-weight'}px; bottom: ${'bar-weight'}px; left: ${'bar-weight'}px;"
        class=${'mask--inner'}
        @mousemove=${'mouseMoveHandler'} @mouseup=${'mouseUpHandler'}
      ></div>
    </div>
  `
})
