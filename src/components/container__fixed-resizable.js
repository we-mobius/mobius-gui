import { makeTacheFormatComponent, useUITache, idToNodeT } from '../helpers/index.js'
import { makeFixedResizableContainerE } from '../elements/index.js'
import {
  minTo, between, minOf,
  windowResizeRD, completeStateRD,
  Data, Mutation, TERMINATOR, replayWithLatest, createDataFromEvent,
  pipeAtom, dataToData,
  pluckT, combineLatestT, switchT, promiseSwitchT,
  mergeT, withLatestFromT, debounceTimeT, throttleTimeT, filterT, zipLatestT,
  takeT, skipUntilT, takeWhileT, truthyPairwiseT,
  makeGeneralEventHandler,
  makeUniqueString,
  tapValueT
} from '../libs/mobius-utils.js'

/**
 * @param styles { top: Number, right: Number, bottom: Number, left: Number, barWeight: Number, minWidth: Number, minHeight: Number }
 * @return component Atom(ReplayMediator)
 */
export const fixedResizableContainerTC = makeTacheFormatComponent({
  prepareSingletonLevelContexts: (_, { useStyles }) => {
    // import parameters
    const topRD = useStyles('top', 100)
    const rightRD = useStyles('right', 100)
    const bottomRD = useStyles('bottom', 100)
    const leftRD = useStyles('left', 100)
    const barWeightRD = useStyles('barWeight', 10)
    const minWidthRD = useStyles('minWidth', 0)
    const minHeightRD = useStyles('minHeight', 0)
    const maxWidthRD = useStyles('maxWidth', 0)
    const maxHeightRD = useStyles('maxHeight', 0)
    const shrinkPriorityRD = useStyles('shrinkPriority', 'none')

    // id of component & DOM Node
    const idRD = replayWithLatest(1, Data.of(makeUniqueString('fixed-resizable-container')))
    const containerRD = idRD.pipe(idToNodeT(100), replayWithLatest(1))

    //                               Client Size Section
    // clientWidth = body offsetWidth + scrollbar weight
    const debouncedWindowResizeRD = windowResizeRD.pipe(debounceTimeT(50), pluckT('target'), replayWithLatest(1))
    const clientSizeRD = debouncedWindowResizeRD.pipe(dataToData(window => [window.document.body.offsetWidth, window.innerHeight]))

    //                              Container Size Section
    // update newest container size when container size has possibly changed
    const containerSizeChangeSourceRD = mergeT(containerRD, debouncedWindowResizeRD, topRD, rightRD, bottomRD, leftRD).pipe(replayWithLatest(1))
    // emit container when window size change
    // ! use promiseSwitchT instead of switchT because there is no container to get
    // ! when containerRD triggers containerSizeChangeSourceRD in the first time
    // TODO: use mergeT & switchT
    const containerWhenSizeChangeD = promiseSwitchT(containerRD, containerSizeChangeSourceRD)
    const containerToContainerSizeM = Mutation.ofLiftLeft(container => [container.offsetWidth, container.offsetHeight])
    const containerSizeRD = replayWithLatest(1, Data.empty())
    pipeAtom(containerWhenSizeChangeD, containerToContainerSizeM, containerSizeRD)

    /******************************************************************************
     *                             Common Use atoms
     ******************************************************************************/

    const changeExtraDetailRD = combineLatestT({
      clientSize: clientSizeRD,
      containerSize: containerSizeRD,
      minWidth: minWidthRD,
      minHeight: minHeightRD,
      maxWidth: maxWidthRD,
      maxHeight: maxHeightRD,
      top: topRD,
      right: rightRD,
      bottom: bottomRD,
      left: leftRD,
      barWeight: barWeightRD
    }).pipe(dataToData(detail => {
      const { clientSize, containerSize, minWidth, minHeight, maxWidth, maxHeight, barWeight } = detail
      return {
        ...detail,
        clientWidth: clientSize[0],
        clientHeight: clientSize[1],
        containerWidth: containerSize[0],
        containerHeight: containerSize[1],
        minWidth: between(barWeight * 2, clientSize[0], minWidth),
        minHeight: between(barWeight * 2, clientSize[1], minHeight),
        maxWidth: minTo(0, maxWidth),
        maxHeight: minTo(0, maxHeight)
      }
    }), replayWithLatest(1))

    /******************************************************************************
     *               Window Resize related container size change
     ******************************************************************************/

    // window resize event will lead to changes of:
    //   -> clientSize & containerSize
    // collect pairwise data of:
    //   -> windowSizeChangeDetail & clientSize & containerSize & top & right & bottom & left
    // according to shrink priority,
    //   -> generate new top & right & bottom & left to adjust container size
    // changes of top & right & bottom & left will lead to new changes of clientSize & containerSize,
    //   -> but will not back to trigger a new turn of window resize

    // const pairwiseChangesRD = mergeT(
    //   switchT(changeExtraDetailRD, debouncedWindowResizeRD), takeT(1, changeExtraDetailRD)
    // ).pipe(pairwiseT, filterT(v => v[0] && v[1]), replayWithLatest(1))

    // get window size change detail when window resize event happens
    // { clientWidth, clientHeight, screenLeft, screenTop }
    const windowSizeChangeDetailRD = debouncedWindowResizeRD.pipe(dataToData(window => ({
      clientWidth: window.document.body.offsetWidth,
      clientHeight: window.innerHeight,
      screenTop: window.screenTop,
      screenLeft: window.screenLeft
    })))
    const pairwiseWindowSizeChangesRD = windowSizeChangeDetailRD.pipe(truthyPairwiseT, replayWithLatest(1))

    // give:
    //   screen width = screen left + client width + screen right + border weight
    //   screen height = screen height + client height + screen bottom + compontent(search bar, console panel...) height + border weight
    // got: (client shrink -> positive, client grow -> negative)
    //   Δtop = screenTop - prevScreenTop
    //   Δright = (prevClientWidth + prevScreenLeft) - (clientWidth + screenLeft)
    //   Δbottom = (prevClientHeight + prevScreenTop) - (clientHeight + screenTop)
    //   Δleft = screenLeft - prevScreenLeft
    const windowTopDeltaM = Mutation.ofLiftLeft(([detail, prevDetail]) => {
      const { screenTop } = detail
      const { screenTop: prevScreenTop } = prevDetail
      return screenTop - prevScreenTop
    })
    const windowRightDeltaM = Mutation.ofLiftLeft(([detail, prevDetail]) => {
      const { clientWidth, screenLeft } = detail
      const { clientWidth: prevClientWidth, screenLeft: prevScreenLeft } = prevDetail
      return (prevClientWidth + prevScreenLeft) - (clientWidth + screenLeft)
    })
    const windowBottomDeltaM = Mutation.ofLiftLeft(([detail, prevDetail]) => {
      const { clientHeight, screenTop } = detail
      const { clientHeight: prevClientHeight, screenTop: prevScreenTop } = prevDetail
      return (prevClientHeight + prevScreenTop) - (clientHeight + screenTop)
    })
    const windowLeftDeltaM = Mutation.ofLiftLeft(([detail, prevDetail]) => {
      const { screenLeft } = detail
      const { screenLeft: prevScreenLeft } = prevDetail
      return screenLeft - prevScreenLeft
    })

    const windowTopDeltaD = Data.empty()
    const windowRightDeltaD = Data.empty()
    const windowBottomDeltaD = Data.empty()
    const windowLeftDeltaD = Data.empty()

    pipeAtom(pairwiseWindowSizeChangesRD, windowTopDeltaM, windowTopDeltaD)
    pipeAtom(pairwiseWindowSizeChangesRD, windowRightDeltaM, windowRightDeltaD)
    pipeAtom(pairwiseWindowSizeChangesRD, windowBottomDeltaM, windowBottomDeltaD)
    pipeAtom(pairwiseWindowSizeChangesRD, windowLeftDeltaM, windowLeftDeltaD)

    // shrink priority: none
    //   -> if container size < min size && client size > min size, set container size to client size
    const noneShrinkPriorityRD = dataToData(v => v === 'none', shrinkPriorityRD)
    const noneShrinkWindowResizeD = takeWhileT(noneShrinkPriorityRD, debouncedWindowResizeRD)
    const noneShrinkChangeExtraDetailD = switchT(changeExtraDetailRD, noneShrinkWindowResizeD)
    const noneShrinkTopM = Mutation.ofLiftLeft((detail) => {
      const { clientHeight, barWeight, containerHeight, minHeight, bottom, top } = detail
      if (bottom >= 0) {
        if (containerHeight < minHeight) {
          const newTop = minOf(top, 0)
          return newTop
        } else {
          return top
        }
      } else {
        const newTop = between(0, minTo(0, clientHeight - barWeight), top)
        return newTop
      }
    })
    const noneShrinkRightM = Mutation.ofLiftLeft((detail) => {
      const { clientWidth, barWeight, containerWidth, minWidth, left, right } = detail
      if (left >= 0) {
        if (containerWidth < minWidth) {
          const newRight = minOf(right, 0)
          return newRight
        } else {
          return right
        }
      } else {
        const newRight = between(0, minTo(0, clientWidth - barWeight), right)
        return newRight
      }
    })
    const noneShrinkBottomM = Mutation.ofLiftLeft((detail) => {
      const { clientHeight, barWeight, containerHeight, minHeight, top, bottom } = detail
      if (top >= 0) {
        if (containerHeight < minHeight) {
          const newBottom = minOf(bottom, 0)
          return newBottom
        } else {
          return bottom
        }
      } else {
        const newBottom = between(0, minTo(0, clientHeight - barWeight), bottom)
        return newBottom
      }
    })
    const noneShrinkLeftM = Mutation.ofLiftLeft((detail) => {
      const { clientWidth, barWeight, containerWidth, minWidth, right, left } = detail
      if (right >= 0) {
        if (containerWidth < minWidth) {
          const newLeft = minOf(left, 0)
          return newLeft
        } else {
          return left
        }
      } else {
        const newLeft = between(0, minTo(0, clientWidth - barWeight), left)
        return newLeft
      }
    })

    const tempTopD = Data.empty()
    const tempRightD = Data.empty()
    const tempBottomD = Data.empty()
    const tempLeftD = Data.empty()

    pipeAtom(noneShrinkChangeExtraDetailD, noneShrinkTopM, tempTopD)
    pipeAtom(noneShrinkChangeExtraDetailD, noneShrinkRightM, tempRightD)
    pipeAtom(noneShrinkChangeExtraDetailD, noneShrinkBottomM, tempBottomD)
    pipeAtom(noneShrinkChangeExtraDetailD, noneShrinkLeftM, tempLeftD)

    const zippedD = zipLatestT({ top: tempTopD, right: tempRightD, bottom: tempBottomD, left: tempLeftD })

    pipeAtom(pluckT('top', zippedD), Mutation.ofLiftLeft(v => v), topRD)
    pipeAtom(pluckT('right', zippedD), Mutation.ofLiftLeft(v => v), rightRD)
    pipeAtom(pluckT('bottom', zippedD), Mutation.ofLiftLeft(v => v), bottomRD)
    pipeAtom(pluckT('left', zippedD), Mutation.ofLiftLeft(v => v), leftRD)

    // TODO: shrink priority: edge, container is relative to screen
    // container position to screen:
    //   -> dx, dy [0, 0]
    //   -> screenX, screenY -> resize -> [dx + deltaScreenX, dy + deltaScreenY]
    // case top < 0 || bottom < 0: set containerHeight to prev containerHeight
    //   -> top < 0:
    //     -> bottom > 0: set bottom to minTo(0, bottom - deltaHeight)
    //       -> window -:
    //     -> bottom = 0: do nothing
    //   -> bottom < 0:
    //     -> top > 0: set top to minTo(0, top - deltaHeight)
    //     -> top = 0: do nothing
    // case top > 0 && bottom > 0
    //   ->
    // case clientHeight > containerHeight > minHeight
    //  ->

    // TODO: shrink priority: container, container is relative to viewport
    // case top < 0 || bottom < 0
    //  -> set maximum of opposite edge(maxTop || maxBottom)
    // case top > 0 && bottom > 0
    //  case containerHeight >= minHeight
    //    -> do nothing
    //  case containerHeight < minHeight
    //    -> shrink edge

    /******************************************************************************
     *              Mouse Move related container size change - COMMON
     ******************************************************************************/

    // mouse down data
    // mouse move data (mouse position) debounce
    // mouse on data
    const [mouseDownHandlerRD, , mouseDownD] = makeGeneralEventHandler()
    const [mouseMoveHandlerRD, , mouseMoveD] = makeGeneralEventHandler()
    const [mouseUpHandlerRD, , mouseUpD] = makeGeneralEventHandler()

    // isHandlingRD: true | false
    // handleTargetRD: top, right, bottom, left, left-top, right-top, right-bottom, left-bottom
    const isHandlingRD = replayWithLatest(1, Data.of(false))
    const handleTypeRD = replayWithLatest(1, Data.of({ resize: false, move: false }))
    const handleTargetRD = replayWithLatest(1, Data.of(undefined))
    const validHandleTargetRD = handleTargetRD.pipe(filterT(v => v), replayWithLatest(1))

    const handleTypeSetterD = Data.empty()
    const setHandleTypeM = Mutation.ofLiftBoth((update, prev) => ({ ...prev, ...update }))
    pipeAtom(handleTypeSetterD, setHandleTypeM, handleTypeRD)
    pipeAtom(handleTypeRD, Mutation.ofLiftLeft(type => Object.values(type).some(v => v)), isHandlingRD)

    // set keypress state
    const isKeyboardPressingRD = replayWithLatest(1, Data.of(false))
    const keydownD = createDataFromEvent(document, 'keydown')[0].pipe(throttleTimeT(250))
    const keyupD = createDataFromEvent(document, 'keyup')[0].pipe(throttleTimeT(250))
    pipeAtom(keydownD, Mutation.of(() => true), isKeyboardPressingRD)
    pipeAtom(keyupD, Mutation.of(() => false), isKeyboardPressingRD)

    // mouse down: set handle target
    const mouseDownToHandleTargetM = Mutation.ofLiftLeft(e => e.target.dataset.name)
    const mouseUpToHandleTargetM = Mutation.of(() => undefined)
    // set handle target states
    pipeAtom(mouseDownD, mouseDownToHandleTargetM, handleTargetRD)
    pipeAtom(mouseUpD, mouseUpToHandleTargetM, handleTargetRD)

    // traceD: [startPosition, endPosition]
    const traceRD = Data.of([undefined, undefined])
    // mouse down: initialize start position of trace with current position, ensure end position equals undefined
    // mouse move: use end position of last trace as start position of new trace,
    //             set current position to end position of new trace
    // mouse up: resizing end, set both of start position & end position of trace to undefined
    const mouseDownToTraceM = Mutation.ofLiftBoth((e) => [[e.clientX, e.clientY], undefined])
    const mouseMoveToTraceM = Mutation.ofLiftBoth((e, trace) => [trace[1] ? trace[1] : [e.clientX, e.clientY], [e.clientX, e.clientY]])
    const mouseUpToTraceM = Mutation.ofLiftBoth(() => [undefined, undefined])
    // set trace data
    pipeAtom(mouseDownD, mouseDownToTraceM, traceRD)
    pipeAtom(takeWhileT(isHandlingRD, mouseMoveD), mouseMoveToTraceM, traceRD)
    pipeAtom(mouseUpD, mouseUpToTraceM, traceRD)

    /******************************************************************************
     *              Mouse Move related container size change - RESIZING
     ******************************************************************************/

    // isResizingD: true | false
    const isResizingRD = replayWithLatest(1, Data.of(false))
    // mouse down: set isResizing to true when there is no key has been press down
    // mouse up: set isResizing to false
    pipeAtom(switchT(isKeyboardPressingRD, mouseDownD), Mutation.ofLiftLeft(isKeyboardPressing => !isKeyboardPressing), isResizingRD)
    pipeAtom(mouseUpD, Mutation.ofLiftLeft(() => false), isResizingRD)
    // sync to isHandlingRD
    pipeAtom(isResizingRD, Mutation.ofLiftLeft(v => ({ resize: v })), handleTypeSetterD)

    // derived Data Atom
    const resizingTraceD = takeWhileT(isResizingRD, traceRD)
    const resizingTopTraceD = takeWhileT(dataToData(v => v.includes('top'), validHandleTargetRD), resizingTraceD)
    const resizingRightTraceD = takeWhileT(dataToData(v => v.includes('right'), validHandleTargetRD), resizingTraceD)
    const resizingBottomTraceD = takeWhileT(dataToData(v => v.includes('bottom'), validHandleTargetRD), resizingTraceD)
    const resizingLeftTraceD = takeWhileT(dataToData(v => v.includes('left'), validHandleTargetRD), resizingTraceD)

    const topDeltaRD = replayWithLatest(1, Data.of(0))
    const rightDeltaRD = replayWithLatest(1, Data.of(0))
    const bottomDeltaRD = replayWithLatest(1, Data.of(0))
    const leftDeltaRD = replayWithLatest(1, Data.of(0))

    const traceToTopDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
      if (!startPosition || !endPosition) return TERMINATOR
      const startY = startPosition[1]
      const endY = endPosition[1]
      const topDelta = endY - startY
      return topDelta
    })
    const traceToRightDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
      if (!startPosition || !endPosition) return TERMINATOR
      const startX = startPosition[0]
      const endX = endPosition[0]
      const rightDelta = startX - endX
      return rightDelta
    })
    const traceToBottomDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
      if (!startPosition || !endPosition) return TERMINATOR
      const startY = startPosition[1]
      const endY = endPosition[1]
      const bottomDelta = startY - endY
      return bottomDelta
    })
    const traceToLeftDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
      if (!startPosition || !endPosition) return TERMINATOR
      const startX = startPosition[0]
      const endX = endPosition[0]
      const leftDelta = endX - startX
      return leftDelta
    })

    pipeAtom(resizingTopTraceD, traceToTopDeltaM, topDeltaRD)
    pipeAtom(resizingRightTraceD, traceToRightDeltaM, rightDeltaRD)
    pipeAtom(resizingBottomTraceD, traceToBottomDeltaM, bottomDeltaRD)
    pipeAtom(resizingLeftTraceD, traceToLeftDeltaM, leftDeltaRD)

    const topChangeDetailD = withLatestFromT(changeExtraDetailRD, topDeltaRD)
    const rightChangeDetailD = withLatestFromT(changeExtraDetailRD, rightDeltaRD)
    const bottomChangeDetailD = withLatestFromT(changeExtraDetailRD, bottomDeltaRD)
    const leftChangeDetailD = withLatestFromT(changeExtraDetailRD, leftDeltaRD)

    const applyTopChangeM = Mutation.ofLiftBoth(([delta, extraDetail], top) => {
      const { clientHeight, containerHeight, minHeight, bottom, barWeight } = extraDetail
      // when bottom bar is out of screen, ensure top bar is always in the screen
      const minTop = bottom < 0 ? 0 : -Infinity
      // when containerHeight < innerHeight
      //  -> it can grow but can not shrink
      //  -> so we use minOf(containerHeight, minHeight) to specify the actual minHeight of container
      const actualMinHeight = minOf(containerHeight, minHeight)
      // clientHeight = top + containerHeight + bottom
      // case minHeight <= clientHeight
      //  -> if bottom > 0, maxTop equals clientHeight - bottom - actualMinHeight
      //  -> if bottom < 0, maxTop equals clientHeight - barWeight (keeps top bar is always in the screen)
      // case minHeight > clientHeight
      //  -> if bottom > 0, maxTop can be negative
      //  -> if bottom < 0, maxTop must in the screen, so it equals 0 in minimum
      const maxTop = minTo(0, minOf(clientHeight - barWeight, clientHeight - bottom - actualMinHeight))
      const newTop = top + delta
      return between(minTop, maxTop, newTop)
    })
    const applyRightChangeM = Mutation.ofLiftBoth(([delta, extraDetail], right) => {
      const { clientWidth, containerWidth, minWidth, left, barWeight } = extraDetail
      const minRight = left < 0 ? 0 : -Infinity
      const actualMinWidth = minOf(containerWidth, minWidth)
      const maxRight = minTo(0, minOf(clientWidth - barWeight, clientWidth - left - actualMinWidth))
      const newRight = right + delta
      return between(minRight, maxRight, newRight)
    })
    const applyBottomChangeM = Mutation.ofLiftBoth(([delta, extraDetail], bottom) => {
      const { clientHeight, containerHeight, minHeight, top, barWeight } = extraDetail
      const minBottom = top < 0 ? 0 : -Infinity
      const actualMinHeight = minOf(containerHeight, minHeight)
      const maxBottom = minTo(0, minOf(clientHeight - barWeight, clientHeight - top - actualMinHeight))
      const newBottom = bottom + delta
      return between(minBottom, maxBottom, newBottom)
    })
    const applyLeftChangeM = Mutation.ofLiftBoth(([delta, extraDetail], left) => {
      const { clientWidth, containerWidth, minWidth, right, barWeight } = extraDetail
      const minLeft = right < 0 ? 0 : -Infinity
      const actualMinWidth = minOf(containerWidth, minWidth)
      const maxLeft = minTo(0, minOf(clientWidth - barWeight, clientWidth - right - actualMinWidth))
      const newLeft = left + delta
      return between(minLeft, maxLeft, newLeft)
    })

    pipeAtom(topChangeDetailD, applyTopChangeM, topRD)
    pipeAtom(rightChangeDetailD, applyRightChangeM, rightRD)
    pipeAtom(bottomChangeDetailD, applyBottomChangeM, bottomRD)
    pipeAtom(leftChangeDetailD, applyLeftChangeM, leftRD)

    /******************************************************************************
     *                Space and Mouse move related container size change
     ******************************************************************************/

    const isMovingRD = replayWithLatest(1, Data.of(false)).pipe(tapValueT('isMoving'))

    // when space key press down, set space key press state to true
    // when space key press up, set space key press state to false
    const isSpaceKeyPressingRD = replayWithLatest(1, Data.of(false)).pipe(tapValueT('space'))
    const spaceDownD = createDataFromEvent(document, 'keydown')[0].pipe(
      filterT(e => e.code === 'Space'),
      skipUntilT(completeStateRD),
      throttleTimeT(250)
    )
    const spaceUpD = createDataFromEvent(document, 'keyup')[0].pipe(
      filterT(e => e.code === 'Space'),
      skipUntilT(completeStateRD),
      throttleTimeT(250)
    )
    const spaceDownM = Mutation.of(() => true)
    const spaceUpM = Mutation.of(() => false)
    pipeAtom(spaceDownD, spaceDownM, isSpaceKeyPressingRD)
    pipeAtom(spaceUpD, spaceUpM, isSpaceKeyPressingRD)
    // mouse down: set isMoving to true when there is space key has been press down
    // mouse up: set isMoving to false
    pipeAtom(switchT(isSpaceKeyPressingRD, mouseDownD), Mutation.ofLiftLeft(v => v), isMovingRD)
    pipeAtom(mouseUpD, Mutation.ofLiftLeft(() => false), isMovingRD)
    // sync to isHandlingRD
    pipeAtom(isMovingRD, Mutation.ofLiftLeft(v => ({ move: v })), handleTypeSetterD)

    const movingTraceD = takeWhileT(isMovingRD, traceRD)

    const movingTraceToYM = Mutation.ofLiftLeft(([[startPosition, endPosition], detail]) => {
      if (!startPosition || !endPosition) return TERMINATOR
      const deltaY = endPosition[1] - startPosition[1]
      const { bottom, top, barWeight, clientHeight } = detail
      const minDeltaY = 0 - (clientHeight - bottom - barWeight)
      const maxDeltaY = clientHeight - top - barWeight
      const validDeltaY = between(minDeltaY, maxDeltaY, deltaY)
      return validDeltaY
    })
    const movingTraceToXM = Mutation.ofLiftLeft(([[startPosition, endPosition], detail]) => {
      if (!startPosition || !endPosition) return TERMINATOR
      const deltaX = endPosition[0] - startPosition[0]
      const { left, right, barWeight, clientWidth } = detail
      const minDeltaX = 0 - (clientWidth - right - barWeight)
      const maxDeltaX = clientWidth - left - barWeight
      const validDeltaX = between(minDeltaX, maxDeltaX, deltaX)
      return validDeltaX
    })

    const deltaYD = Data.empty()
    const deltaXD = Data.empty()

    pipeAtom(movingTraceD.pipe(withLatestFromT(changeExtraDetailRD)), movingTraceToYM, deltaYD)
    pipeAtom(movingTraceD.pipe(withLatestFromT(changeExtraDetailRD)), movingTraceToXM, deltaXD)

    pipeAtom(deltaYD, Mutation.ofLiftBoth((delta, top) => top + delta), topRD)
    pipeAtom(deltaXD, Mutation.ofLiftBoth((delta, right) => right - delta), rightRD)
    pipeAtom(deltaYD, Mutation.ofLiftBoth((delta, bottom) => bottom - delta), bottomRD)
    pipeAtom(deltaXD, Mutation.ofLiftBoth((delta, left) => left + delta), leftRD)

    /******************************************************************************
     *                 Mouse dbClick related container size change
     ******************************************************************************/

    const [dbClickHandlerRD, , dbClickD] = makeGeneralEventHandler()

    const positionDetailRD = combineLatestT({ top: topRD, right: rightRD, bottom: bottomRD, left: leftRD }).pipe(tapValueT('positionDetailRD'))
    const positionCacheD = mergeT(switchT(positionDetailRD, dbClickD).pipe(tapValueT('switch')), takeT(1, positionDetailRD).pipe(tapValueT('take')))
      .pipe(tapValueT('merge'), truthyPairwiseT, tapValueT('pair'))

    const maxMizeM = Mutation.ofLiftLeft(([cur, prev]) => {
      const { top, right, bottom, left } = cur
      if (top !== 0 || right !== 0 || bottom !== 0 || left !== 0) {
        return { top: 0, right: 0, bottom: 0, left: 0 }
      } else {
        return prev
      }
    })
    const positionSetD = Data.empty()
    pipeAtom(positionCacheD, maxMizeM, positionSetD)

    pipeAtom(pluckT('top', positionSetD), Mutation.ofLiftLeft(v => v), topRD)
    pipeAtom(pluckT('right', positionSetD), Mutation.ofLiftLeft(v => v), rightRD)
    pipeAtom(pluckT('bottom', positionSetD), Mutation.ofLiftLeft(v => v), bottomRD)
    pipeAtom(pluckT('left', positionSetD), Mutation.ofLiftLeft(v => v), leftRD)

    return combineLatestT({
      id: idRD,
      top: topRD,
      right: rightRD,
      bottom: bottomRD,
      left: leftRD,
      barWeight: barWeightRD,
      mouseDownHandler: mouseDownHandlerRD,
      mouseMoveHandler: mouseMoveHandlerRD,
      mouseUpHandler: mouseUpHandlerRD,
      dbClickHandler: dbClickHandlerRD,
      isHandling: isHandlingRD,
      isResizing: isResizingRD,
      isMoving: isMovingRD,
      isPrepareToMoving: isSpaceKeyPressingRD
    })
  },
  prepareTemplate: ({ marks, styles, actuations, configs, singletonLevelContexts }) => {
    marks = {
      ...marks,
      id: singletonLevelContexts.id
    }
    styles = {
      ...styles,
      'position--top': singletonLevelContexts.top,
      'position--right': singletonLevelContexts.right,
      'position--bottom': singletonLevelContexts.bottom,
      'position--left': singletonLevelContexts.left,
      'bar-weight': singletonLevelContexts.barWeight
    }
    actuations = {
      ...actuations,
      mouseDownHandler: singletonLevelContexts.mouseDownHandler,
      mouseMoveHandler: singletonLevelContexts.mouseMoveHandler,
      mouseUpHandler: singletonLevelContexts.mouseUpHandler,
      dbClickHandler: singletonLevelContexts.dbClickHandler
    }
    configs = {
      ...configs,
      isHandling: singletonLevelContexts.isHandling,
      isResizing: singletonLevelContexts.isResizing,
      isMoving: singletonLevelContexts.isMoving,
      isPrepareToMoving: singletonLevelContexts.isPrepareToMoving
    }
    return makeFixedResizableContainerE({ marks, styles, actuations, configs })
  }
})

export const useFixedResizableContainerTC = useUITache(fixedResizableContainerTC)
