export {}
// import {
//   minTo, between, minOf,
//   completeStateRD,
//   Data, Mutation, TERMINATOR, replayWithLatest, createDataFromEvent,
//   pipeAtom, dataToData,
//   pluckT, combineLatestT, switchT_,
//   convergeT, withLatestFromT_, debounceTimeT, throttleTimeT_, filterT_,
//   takeT, skipUntilT_, takeWhileT, truthyPairwiseT,
//   makeGeneralEventHandler,
//   tapValueT_,
//   createGeneralDriver, useGeneralDriver_
// } from '../libs/mobius-utils'

// export const resizableDriver = createGeneralDriver({
//   prepareSingletonLevelContexts: (options, driverLevelContexts) => {
//     const wrapperContainerRD = replayWithLatest(1, Data.empty())
//     const targetContainerRD = replayWithLatest(1, Data.empty())
//     const topRD = replayWithLatest(1, Data.empty(100))
//     const rightRD = replayWithLatest(1, Data.empty(100))
//     const bottomRD = replayWithLatest(1, Data.empty(100))
//     const leftRD = replayWithLatest(1, Data.empty(100))
//     const barWeightRD = replayWithLatest(1, Data.empty(10))
//     const minWidthRD = replayWithLatest(1, Data.empty(0))
//     const minHeightRD = replayWithLatest(1, Data.empty(0))
//     const maxWidthRD = replayWithLatest(1, Data.empty(0))
//     const maxHeightRD = replayWithLatest(1, Data.empty(0))

//     /**
//      *                                WrapperContainer Size Section
//      * take a container
//      *   -> merge
//      *     -> read container's width & height
//      *     -> observe resize -> emit width & height -> debounce
//      *   -> [width, height]
//      */

//     const _wrapperContainerResizeM = Mutation.ofLiftLeft((container, _, mutation) => {
//       const resizeObserver = new ResizeObserver(entries => {
//         for (const entry of entries) {
//           const { contentRect: { width, height } } = entry
//           mutation.triggerTransformation(() => ([width, height]))
//         }
//       })
//       resizeObserver.observe(container)
//       return TERMINATOR
//     })
//     const _wrapperContainerResizeRD = replayWithLatest(1, Data.empty())
//     pipeAtom(wrapperContainerRD, _wrapperContainerResizeM, _wrapperContainerResizeRD)
//     const debouncedWrapperContainerResizeRD = _wrapperContainerResizeRD.pipe(debounceTimeT(50), replayWithLatest(1))
//     const wrapperContainerSizeRD = convergeT(
//       wrapperContainerRD.pipe(dataToData(c => [c.clientWidth, c.clientHeight])),
//       debouncedWrapperContainerResizeRD
//     )
//     tapValueT_('wrapperContainerSizeRD')(wrapperContainerSizeRD)

//     /**
//      *                               TargetContainer Size Section
//      *  update newest container size when container size has possibly changed
//      */

//     const _targetContainerSizeChangeSourceRD = convergeT(
//       debouncedWrapperContainerResizeRD, topRD, rightRD, bottomRD, leftRD
//     ).pipe(replayWithLatest(1), switchT_(targetContainerRD), replayWithLatest(1))
//     const _targetContainerWhenSizeChangeD = convergeT(targetContainerRD, _targetContainerSizeChangeSourceRD)
//     const targetContainerSizeRD = replayWithLatest(1, Data.empty())
//     pipeAtom(
//       _targetContainerWhenSizeChangeD,
//       Mutation.ofLiftLeft(c => [c.offsetWidth, c.offsetHeight]),
//       targetContainerSizeRD
//     )
//     tapValueT_('targetContainerSizeRD')(targetContainerSizeRD)

//     /******************************************************************************
//      *                             Common Use atoms
//      ******************************************************************************/

//     const changeExtraDetailRD = combineLatestT({
//       wrapperContainerSize: wrapperContainerSizeRD,
//       targetContainerSize: targetContainerSizeRD,
//       minWidth: minWidthRD,
//       minHeight: minHeightRD,
//       maxWidth: maxWidthRD,
//       maxHeight: maxHeightRD,
//       top: topRD,
//       right: rightRD,
//       bottom: bottomRD,
//       left: leftRD,
//       barWeight: barWeightRD
//     }).pipe(dataToData(detail => {
//       const { wrapperContainerSize, targetContainerSize, minWidth, minHeight, maxWidth, maxHeight, barWeight } = detail
//       return {
//         ...detail,
//         wrapperContainerWidth: wrapperContainerSize[0],
//         wrapperContainerHeight: wrapperContainerSize[1],
//         targetContainerWidth: targetContainerSize[0],
//         targetContainerHeight: targetContainerSize[1],
//         minWidth: between(barWeight * 2, wrapperContainerSize[0], minWidth),
//         minHeight: between(barWeight * 2, wrapperContainerSize[1], minHeight),
//         maxWidth: minTo(0, maxWidth),
//         maxHeight: minTo(0, maxHeight)
//       }
//     }), replayWithLatest(1))

//     /******************************************************************************
//      *              Mouse Move related container size change - COMMON
//      ******************************************************************************/

//     // mouse down data
//     // mouse move data (mouse position) debounce
//     // mouse on data
//     const [mouseDownHandlerRD, , mouseDownD] = makeGeneralEventHandler()
//     const [mouseMoveHandlerRD, , mouseMoveD] = makeGeneralEventHandler()
//     const [mouseUpHandlerRD, , mouseUpD] = makeGeneralEventHandler()

//     // isHandlingRD: true | false
//     // handleTargetRD: top, right, bottom, left, left-top, right-top, right-bottom, left-bottom
//     const isHandlingRD = replayWithLatest(1, Data.of(false))
//     const handleTypeRD = replayWithLatest(1, Data.of({ resize: false, move: false }))
//     const handleTargetRD = replayWithLatest(1, Data.of(undefined))
//     const validHandleTargetRD = handleTargetRD.pipe(filterT_(v => v), replayWithLatest(1))

//     const handleTypeSetterD = Data.empty()
//     const setHandleTypeM = Mutation.ofLiftBoth((update, prev) => ({ ...prev, ...update }))
//     pipeAtom(handleTypeSetterD, setHandleTypeM, handleTypeRD)
//     pipeAtom(handleTypeRD, Mutation.ofLiftLeft(type => Object.values(type).some(v => v)), isHandlingRD)

//     // set keypress state
//     const isKeyboardPressingRD = replayWithLatest(1, Data.of(false))
//     const keydownD = createDataFromEvent({ target: document, type: 'keydown' })[0].pipe(throttleTimeT_(250))
//     const keyupD = createDataFromEvent({ target: document, type: 'keyup' })[0].pipe(throttleTimeT_(250))
//     pipeAtom(keydownD, Mutation.of(() => true), isKeyboardPressingRD)
//     pipeAtom(keyupD, Mutation.of(() => false), isKeyboardPressingRD)

//     // mouse down: set handle target
//     const mouseDownToHandleTargetM = Mutation.ofLiftLeft(e => e.target.dataset.name)
//     const mouseUpToHandleTargetM = Mutation.of(() => undefined)
//     // set handle target states
//     pipeAtom(mouseDownD, mouseDownToHandleTargetM, handleTargetRD)
//     pipeAtom(mouseUpD, mouseUpToHandleTargetM, handleTargetRD)

//     // traceD: [startPosition, endPosition]
//     const traceRD = Data.of([undefined, undefined])
//     // mouse down: initialize start position of trace with current position, ensure end position equals undefined
//     // mouse move: use end position of last trace as start position of new trace,
//     //             set current position to end position of new trace
//     // mouse up: resizing end, set both of start position & end position of trace to undefined
//     const mouseDownToTraceM = Mutation.ofLiftBoth((e) => [[e.clientX, e.clientY], undefined])
//     const mouseMoveToTraceM = Mutation.ofLiftBoth((e, trace) => [trace[1] ? trace[1] : [e.clientX, e.clientY], [e.clientX, e.clientY]])
//     const mouseUpToTraceM = Mutation.ofLiftBoth(() => [undefined, undefined])
//     // set trace data
//     pipeAtom(mouseDownD, mouseDownToTraceM, traceRD)
//     pipeAtom(takeWhileT(isHandlingRD, mouseMoveD), mouseMoveToTraceM, traceRD)
//     pipeAtom(mouseUpD, mouseUpToTraceM, traceRD)

//     /******************************************************************************
//      *              Mouse Move related container size change - RESIZING
//      ******************************************************************************/

//     // isResizingD: true | false
//     const isResizingRD = replayWithLatest(1, Data.of(false))
//     // mouse down: set isResizing to true when there is no key has been press down
//     // mouse up: set isResizing to false
//     pipeAtom(switchT_(isKeyboardPressingRD, mouseDownD), Mutation.ofLiftLeft(isKeyboardPressing => !isKeyboardPressing), isResizingRD)
//     pipeAtom(mouseUpD, Mutation.ofLiftLeft(() => false), isResizingRD)
//     // sync to isHandlingRD
//     pipeAtom(isResizingRD, Mutation.ofLiftLeft(v => ({ resize: v })), handleTypeSetterD)

//     // derived Data Atom
//     const resizingTraceD = takeWhileT(isResizingRD, traceRD)
//     const resizingTopTraceD = takeWhileT(dataToData(v => v.includes('top'), validHandleTargetRD), resizingTraceD)
//     const resizingRightTraceD = takeWhileT(dataToData(v => v.includes('right'), validHandleTargetRD), resizingTraceD)
//     const resizingBottomTraceD = takeWhileT(dataToData(v => v.includes('bottom'), validHandleTargetRD), resizingTraceD)
//     const resizingLeftTraceD = takeWhileT(dataToData(v => v.includes('left'), validHandleTargetRD), resizingTraceD)

//     const topDeltaRD = replayWithLatest(1, Data.of(0))
//     const rightDeltaRD = replayWithLatest(1, Data.of(0))
//     const bottomDeltaRD = replayWithLatest(1, Data.of(0))
//     const leftDeltaRD = replayWithLatest(1, Data.of(0))

//     const traceToTopDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
//       if (!startPosition || !endPosition) return TERMINATOR
//       const startY = startPosition[1]
//       const endY = endPosition[1]
//       const topDelta = endY - startY
//       return topDelta
//     })
//     const traceToRightDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
//       if (!startPosition || !endPosition) return TERMINATOR
//       const startX = startPosition[0]
//       const endX = endPosition[0]
//       const rightDelta = startX - endX
//       return rightDelta
//     })
//     const traceToBottomDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
//       if (!startPosition || !endPosition) return TERMINATOR
//       const startY = startPosition[1]
//       const endY = endPosition[1]
//       const bottomDelta = startY - endY
//       return bottomDelta
//     })
//     const traceToLeftDeltaM = Mutation.ofLiftLeft(([startPosition, endPosition]) => {
//       if (!startPosition || !endPosition) return TERMINATOR
//       const startX = startPosition[0]
//       const endX = endPosition[0]
//       const leftDelta = endX - startX
//       return leftDelta
//     })

//     pipeAtom(resizingTopTraceD, traceToTopDeltaM, topDeltaRD)
//     pipeAtom(resizingRightTraceD, traceToRightDeltaM, rightDeltaRD)
//     pipeAtom(resizingBottomTraceD, traceToBottomDeltaM, bottomDeltaRD)
//     pipeAtom(resizingLeftTraceD, traceToLeftDeltaM, leftDeltaRD)

//     const topChangeDetailD = withLatestFromT_(changeExtraDetailRD, topDeltaRD)
//     const rightChangeDetailD = withLatestFromT_(changeExtraDetailRD, rightDeltaRD)
//     const bottomChangeDetailD = withLatestFromT_(changeExtraDetailRD, bottomDeltaRD)
//     const leftChangeDetailD = withLatestFromT_(changeExtraDetailRD, leftDeltaRD)

//     const applyTopChangeM = Mutation.ofLiftBoth(([delta, extraDetail], top) => {
//       const { wrapperContainerHeight, targetContainerHeight, minHeight, bottom, barWeight } = extraDetail
//       // when bottom bar is out of view, ensure top bar is always in the view
//       const minTop = bottom < 0 ? 0 : -Infinity
//       // when targetContainerHeight < innerHeight
//       //  -> it can grow but can not shrink
//       //  -> so we use minOf(targetContainerHeight, minHeight) to specify the actual minHeight of targetContainer
//       const actualMinHeight = minOf(targetContainerHeight, minHeight)
//       // wrapperContainerHeight = top + targetContainerHeight + bottom
//       // case minHeight <= wrapperContainerHeight
//       //  -> if bottom > 0, maxTop equals wrapperContainerHeight - bottom - actualMinHeight
//       //  -> if bottom < 0, maxTop equals wrapperContainerHeight - barWeight (keeps top bar is always in the view)
//       // case minHeight > wrapperContainerHeight
//       //  -> if bottom > 0, maxTop can be negative
//       //  -> if bottom < 0, maxTop must in the view, so it equals 0 in minimum
//       const maxTop = minTo(0, minOf(wrapperContainerHeight - barWeight, wrapperContainerHeight - bottom - actualMinHeight))
//       const newTop = top + delta
//       return between(minTop, maxTop, newTop)
//     })
//     const applyRightChangeM = Mutation.ofLiftBoth(([delta, extraDetail], right) => {
//       const { wrapperContainerWidth, targetContainerWidth, minWidth, left, barWeight } = extraDetail
//       const minRight = left < 0 ? 0 : -Infinity
//       const actualMinWidth = minOf(targetContainerWidth, minWidth)
//       const maxRight = minTo(0, minOf(wrapperContainerWidth - barWeight, wrapperContainerWidth - left - actualMinWidth))
//       const newRight = right + delta
//       return between(minRight, maxRight, newRight)
//     })
//     const applyBottomChangeM = Mutation.ofLiftBoth(([delta, extraDetail], bottom) => {
//       const { wrapperContainerHeight, targetContainerHeight, minHeight, top, barWeight } = extraDetail
//       const minBottom = top < 0 ? 0 : -Infinity
//       const actualMinHeight = minOf(targetContainerHeight, minHeight)
//       const maxBottom = minTo(0, minOf(wrapperContainerHeight - barWeight, wrapperContainerHeight - top - actualMinHeight))
//       const newBottom = bottom + delta
//       return between(minBottom, maxBottom, newBottom)
//     })
//     const applyLeftChangeM = Mutation.ofLiftBoth(([delta, extraDetail], left) => {
//       const { wrapperContainerWidth, targetContainerWidth, minWidth, right, barWeight } = extraDetail
//       const minLeft = right < 0 ? 0 : -Infinity
//       const actualMinWidth = minOf(targetContainerWidth, minWidth)
//       const maxLeft = minTo(0, minOf(wrapperContainerWidth - barWeight, wrapperContainerWidth - right - actualMinWidth))
//       const newLeft = left + delta
//       return between(minLeft, maxLeft, newLeft)
//     })

//     pipeAtom(topChangeDetailD, applyTopChangeM, topRD)
//     pipeAtom(rightChangeDetailD, applyRightChangeM, rightRD)
//     pipeAtom(bottomChangeDetailD, applyBottomChangeM, bottomRD)
//     pipeAtom(leftChangeDetailD, applyLeftChangeM, leftRD)

//     /******************************************************************************
//      *                Space and Mouse move related container size change
//      ******************************************************************************/

//     const isMovingRD = replayWithLatest(1, Data.of(false)).pipe(tapValueT_('isMoving'))

//     // when space key press down, set space key press state to true
//     // when space key press up, set space key press state to false
//     const isSpaceKeyPressingRD = replayWithLatest(1, Data.of(false)).pipe(tapValueT_('space'))
//     const spaceDownD = createDataFromEvent({ target: document, type: 'keydown' })[0].pipe(
//       filterT_(e => e.code === 'Space'),
//       skipUntilT_(completeStateRD),
//       throttleTimeT_(250)
//     )
//     const spaceUpD = createDataFromEvent({ target: document, type: 'keyup' })[0].pipe(
//       filterT_(e => e.code === 'Space'),
//       skipUntilT_(completeStateRD),
//       throttleTimeT_(250)
//     )
//     const spaceDownM = Mutation.of(() => true)
//     const spaceUpM = Mutation.of(() => false)
//     pipeAtom(spaceDownD, spaceDownM, isSpaceKeyPressingRD)
//     pipeAtom(spaceUpD, spaceUpM, isSpaceKeyPressingRD)
//     // mouse down: set isMoving to true when there is space key has been press down
//     // mouse up: set isMoving to false
//     pipeAtom(switchT_(isSpaceKeyPressingRD, mouseDownD), Mutation.ofLiftLeft(v => v), isMovingRD)
//     pipeAtom(mouseUpD, Mutation.ofLiftLeft(() => false), isMovingRD)
//     // sync to isHandlingRD
//     pipeAtom(isMovingRD, Mutation.ofLiftLeft(v => ({ move: v })), handleTypeSetterD)

//     const movingTraceD = takeWhileT(isMovingRD, traceRD)

//     const movingTraceToYM = Mutation.ofLiftLeft(([[startPosition, endPosition], detail]) => {
//       if (!startPosition || !endPosition) return TERMINATOR
//       const deltaY = endPosition[1] - startPosition[1]
//       const { bottom, top, barWeight, wrapperContainerHeight } = detail
//       const minDeltaY = 0 - (wrapperContainerHeight - bottom - barWeight)
//       const maxDeltaY = wrapperContainerHeight - top - barWeight
//       const validDeltaY = between(minDeltaY, maxDeltaY, deltaY)
//       return validDeltaY
//     })
//     const movingTraceToXM = Mutation.ofLiftLeft(([[startPosition, endPosition], detail]) => {
//       if (!startPosition || !endPosition) return TERMINATOR
//       const deltaX = endPosition[0] - startPosition[0]
//       const { left, right, barWeight, wrapperContainerWidth } = detail
//       const minDeltaX = 0 - (wrapperContainerWidth - right - barWeight)
//       const maxDeltaX = wrapperContainerWidth - left - barWeight
//       const validDeltaX = between(minDeltaX, maxDeltaX, deltaX)
//       return validDeltaX
//     })

//     const deltaYD = Data.empty()
//     const deltaXD = Data.empty()

//     pipeAtom(movingTraceD.pipe(withLatestFromT_(changeExtraDetailRD)), movingTraceToYM, deltaYD)
//     pipeAtom(movingTraceD.pipe(withLatestFromT_(changeExtraDetailRD)), movingTraceToXM, deltaXD)

//     pipeAtom(deltaYD, Mutation.ofLiftBoth((delta, top) => top + delta), topRD)
//     pipeAtom(deltaXD, Mutation.ofLiftBoth((delta, right) => right - delta), rightRD)
//     pipeAtom(deltaYD, Mutation.ofLiftBoth((delta, bottom) => bottom - delta), bottomRD)
//     pipeAtom(deltaXD, Mutation.ofLiftBoth((delta, left) => left + delta), leftRD)

//     /******************************************************************************
//      *                 Mouse dbClick related container size change
//      ******************************************************************************/

//     const [dbClickHandlerRD, , dbClickD] = makeGeneralEventHandler()

//     const positionDetailRD = combineLatestT({ top: topRD, right: rightRD, bottom: bottomRD, left: leftRD }).pipe(tapValueT_('positionDetailRD'))
//     const positionCacheD = convergeT(switchT_(positionDetailRD, dbClickD).pipe(tapValueT_('switch')), takeT(1, positionDetailRD).pipe(tapValueT_('take')))
//       .pipe(tapValueT_('merge'), truthyPairwiseT, tapValueT_('pair'))

//     const maxMizeM = Mutation.ofLiftLeft(([cur, prev]) => {
//       const { top, right, bottom, left } = cur
//       if (top !== 0 || right !== 0 || bottom !== 0 || left !== 0) {
//         return { top: 0, right: 0, bottom: 0, left: 0 }
//       } else {
//         return prev
//       }
//     })
//     const positionSetD = Data.empty()
//     pipeAtom(positionCacheD, maxMizeM, positionSetD)

//     pipeAtom(pluckT('top', positionSetD), Mutation.ofLiftLeft(v => v), topRD)
//     pipeAtom(pluckT('right', positionSetD), Mutation.ofLiftLeft(v => v), rightRD)
//     pipeAtom(pluckT('bottom', positionSetD), Mutation.ofLiftLeft(v => v), bottomRD)
//     pipeAtom(pluckT('left', positionSetD), Mutation.ofLiftLeft(v => v), leftRD)

//     return {
//       inputs: {},
//       outputs: {
//         top: topRD,
//         right: rightRD,
//         bottom: bottomRD,
//         left: leftRD,
//         barWeight: barWeightRD,
//         mouseDownHandler: mouseDownHandlerRD,
//         mouseMoveHandler: mouseMoveHandlerRD,
//         mouseUpHandler: mouseUpHandlerRD,
//         dbClickHandler: dbClickHandlerRD,
//         isHandling: isHandlingRD,
//         isResizing: isResizingRD,
//         isMoving: isMovingRD,
//         isPrepareToMoving: isSpaceKeyPressingRD
//       }
//     }
//   }
// })

// export const useResizableDriver = useGeneralDriver_(resizableDriver)
