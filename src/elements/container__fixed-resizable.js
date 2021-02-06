import { makeElementMaker } from '../helpers/index.js'

const useCursorStyle = ({ isPrepareToMoving, isMoving }, dft) => {
  return `${!isPrepareToMoving ? dft : ''}` +
  `${isPrepareToMoving && !isMoving ? 'cursor--grab' : ''}` +
  `${isMoving ? 'cursor--grabbing' : ''}`
}
const useShowStyle = ({ isHandling }) => {
  return `${isHandling ? 'display--block' : 'display--none'}`
}

/**
 * @param marks Object, {}
 * @param styles Object, {}
 * @param actuations Object, {}
 * @param configs Object, {}
 * @return TemplateResult
 */
export const makeFixedResizableContainerE = makeElementMaker({
  marks: {},
  styles: {
    'container--outer': ({ isHandling }) => 'position--fixed ' + `${isHandling ? 'mobius-select--none' : ''}`,
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
    'bar-weight': '20',
    'position--top': 0,
    'position--right': 0,
    'position--bottom': 0,
    'position--left': 0
  },
  actuations: {},
  config: {
    isHandling: false,
    isResizing: false,
    isPrepareToMoving: false,
    isMoving: false
  },
  handler: view => view`
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
