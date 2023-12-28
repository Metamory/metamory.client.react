
import { removeAtIndex } from "../../../components/array-helpers"
import { maxBy } from "../../../components/reducer-helpers"
import { initialAnnotatedText } from "../AnnotatedTextEditorContext"
import { AnnotatedText, Annotation, Segment, SplitPoint, segmentComparer } from "./types"

export type ACTION =
    | { type: "EDIT_ANNOTATED_TEXT", text: string }
    | { type: "ADD_ANNOTATION_TO_ANNOTATED_TEXT", fromSplitPoint: SplitPoint, toSplitPoint: SplitPoint, text: string }
    | { type: "REMOVE_ANNOTATION_FROM_ANNOTATED_TEXT", annotationIndex: number }


export function annotatedTextReducer(state: AnnotatedText = initialAnnotatedText, action: ACTION) {
    switch (action.type) {
        case "EDIT_ANNOTATED_TEXT": {
            return {
                ...state,
                text: action.text
            }
        }

        case "ADD_ANNOTATION_TO_ANNOTATED_TEXT": {
            const newAnnotation: Annotation = {
                type: "footnote",
                id: state.annotations.reduce(maxBy(annotation => annotation.id), 0) + 1,
                text: action.text
            }
            const segments = annotate(state.segments, action.fromSplitPoint, action.toSplitPoint, newAnnotation.id)

            return {
                ...state,
                segments,
                annotations: [...state.annotations, newAnnotation]
            }
        }

        case "REMOVE_ANNOTATION_FROM_ANNOTATED_TEXT": {
            //TODO: sequential segments with the same annotation should be merged
            const annotationIdToRemove = state.annotations[action.annotationIndex].id
            return {
                ...state,
                segments: state.segments
                    .map(segment => ({
                        ...segment,
                        annotationIds: segment.annotationIds.filter(annotationId => annotationId !== annotationIdToRemove)
                    }))
                    .reduce(compactSegments, []),
                annotations: removeAtIndex(state.annotations, action.annotationIndex),
            }
        }

        default:
            return state
    }
}

function compactSegments(aggregatedSegments: Array<Segment>, currentSegment: Segment) {
    if (currentSegment.text.length === 0) {
        return aggregatedSegments
    }

    if (aggregatedSegments.length > 0
        && compareArrays(aggregatedSegments[aggregatedSegments.length - 1].annotationIds, currentSegment.annotationIds)) {
        aggregatedSegments[aggregatedSegments.length - 1].text = aggregatedSegments[aggregatedSegments.length - 1].text + currentSegment.text
        return aggregatedSegments
    }

    aggregatedSegments.push(currentSegment)
    return aggregatedSegments
}

function compareArrays<T>(a: Array<T>, b: Array<T>) {
    if (a.length !== b.length) {
        return false
    }

    const bCopy = [...b]
    for (let i = 0; i < a.length; i++) {
        const removed = bCopy.splice(bCopy.indexOf(a[i]), 1)
        if (removed.length === 0) {
            return false
        }
    }
    if(bCopy.length > 0) {
        return false
    }

    return true
}

function annotate(segments: Segment[], fromSplitPoint: SplitPoint, toSplitPoint: SplitPoint, annotationId: number) {
    const [firstSplitPoint, lastSplitPoint] = [fromSplitPoint, toSplitPoint].sort(segmentComparer)

    const retArray = [...segments.map(segment => ({ ...segment }))]

    if (firstSplitPoint.segmentIndex === lastSplitPoint.segmentIndex) {
        const segmentToSplit = retArray[firstSplitPoint.segmentIndex]

        const leftSegment = {
            ...segmentToSplit,
            text: segmentToSplit.text.substring(0, firstSplitPoint.charPos)
        }

        const middleSegment = {
            ...segmentToSplit,
            text: segmentToSplit.text.substring(firstSplitPoint.charPos, lastSplitPoint.charPos)
        }

        const rightSegment = {
            ...segmentToSplit,
            text: segmentToSplit.text.substring(lastSplitPoint.charPos)
        }

        retArray.splice(firstSplitPoint.segmentIndex, 1, leftSegment, middleSegment, rightSegment)
    } else {
        // when the text spans multiple segments,
        // the last segment must be handled first...
        const lastSegmentToSplit = retArray[lastSplitPoint.segmentIndex]

        const leftReplacementForLastSegment = {
            ...lastSegmentToSplit,
            text: lastSegmentToSplit.text.substring(0, lastSplitPoint.charPos)
        }

        const rightReplacementForLastSegment = {
            ...lastSegmentToSplit,
            text: lastSegmentToSplit.text.substring(lastSplitPoint.charPos)
        }

        retArray.splice(lastSplitPoint.segmentIndex, 1, leftReplacementForLastSegment, rightReplacementForLastSegment)

        // ...and the first segment must be handled second
        const firstSegmentToSplit = retArray[firstSplitPoint.segmentIndex]

        const newLeftFirstSegment = {
            ...firstSegmentToSplit,
            text: firstSegmentToSplit.text.substring(0, firstSplitPoint.charPos)
        }

        const newRightFirstSegment = {
            ...firstSegmentToSplit,
            text: firstSegmentToSplit.text.substring(firstSplitPoint.charPos)
        }

        retArray.splice(firstSplitPoint.segmentIndex, 1, newLeftFirstSegment, newRightFirstSegment)
    }

    // add the new annotation
    retArray
        .slice(firstSplitPoint.segmentIndex + 1, lastSplitPoint.segmentIndex + 2)
        .forEach((segment, ix) => {
            segment.annotationIds = [...segment.annotationIds, annotationId]
        })

    // remove empty segments from return value
    return retArray.filter(segment => segment.text.length > 0)
}
