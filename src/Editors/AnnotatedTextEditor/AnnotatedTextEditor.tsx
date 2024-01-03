import React, { useContext, useEffect, useRef, useState } from "react"
import "./AnnotatedTextEditor.css"
import { ACTION, annotatedTextReducer } from "./Reducers/AnnotatedTextReducer"
import { useContentReducer } from "../../Metamory/useContentReducer"
import { AnnotatedTextEditorContext, initialAnnotatedText } from "./AnnotatedTextEditorContext"
import { Footnote, Segment, SplitPoint, segmentComparer } from "./Reducers/types"
import classNames from "classnames"
import ReactMarkdown from "react-markdown"


export const AnnotatedTextEditor = () => {
	const [state, dispatch] = useContentReducer<any, ACTION>(annotatedTextReducer, initialAnnotatedText)

	const tocEditorContext = {
		state,
		dispatch
	}

	return (
		<div className="frame annotated-text-editor-container">
			<AnnotatedTextEditorContext.Provider value={tocEditorContext}>
				<AnnotatedTextEditorInner />
			</AnnotatedTextEditorContext.Provider>
		</div>
	)
}

AnnotatedTextEditor.mimeType = "application/annotated-text+json"

type SelectionRequest = {
	fromSegmentIndex: number
	toSegmentIndex: number
}

const AnnotatedTextEditorInner = () => {
	const { dispatch, state } = useContext(AnnotatedTextEditorContext)
	const [newSelectionRequest, setNewSelectionRequest] = useState<SelectionRequest | undefined>(undefined)
	const textNode = useRef<HTMLParagraphElement>(null)

	const clicked1 = () => {
		const selection = window.getSelection()
		console.log("***", { state, selection })
	}

	useEffect(() => {
		if (newSelectionRequest === undefined) {
			return
		}

		const selection = window.getSelection()
		if (selection === null) {
			return
		}

		const fromNode = document.querySelector(`.segment[data-segment-index="${newSelectionRequest.fromSegmentIndex}"]`)!
		const toNode = document.querySelector(`.segment[data-segment-index="${newSelectionRequest.toSegmentIndex}"]`)!

		selection.removeAllRanges()
		const range = new Range()
		range.setStartBefore(fromNode)
		range.setEndAfter(toNode)
		selection.addRange(range)

		setNewSelectionRequest(undefined)
	}, [state.segments, newSelectionRequest])

	const addFootnote = () => {
		const selection = window.getSelection()

		if (selection !== undefined
			&& selection !== null
			&& textNode.current?.contains(selection.anchorNode)
			&& textNode.current?.contains(selection.focusNode)
		) {
			const fromSplitPoint = { segmentIndex: Number.parseInt(selection.anchorNode?.parentElement?.dataset.segmentIndex ?? "", 10), charPos: selection.anchorOffset }
			const toSplitPoint = { segmentIndex: Number.parseInt(selection.focusNode?.parentElement?.dataset.segmentIndex ?? "", 10), charPos: selection.focusOffset }

			const textToAnnotate = getTextBetweenSplitPoints(state.segments, fromSplitPoint, toSplitPoint)
			dispatch({ type: "ADD_ANNOTATION_TO_ANNOTATED_TEXT", fromSplitPoint, toSplitPoint, text: `This is an annotation for "${textToAnnotate}"` })

			const selectionFromSegmentIndex = fromSplitPoint.segmentIndex + (fromSplitPoint.charPos === 0 ? 0 : 1)
			const numberOfSegments = toSplitPoint.segmentIndex - fromSplitPoint.segmentIndex
			const selectionToSegmentIndex = selectionFromSegmentIndex + numberOfSegments

			setNewSelectionRequest({ fromSegmentIndex: selectionFromSegmentIndex, toSegmentIndex: selectionToSegmentIndex })
		}
	}

	const onChange = () => {
		dispatch({ type: "EDIT_ANNOTATED_TEXT", text: textNode.current?.textContent ?? "" })
	}

	const remove = (annotationIndex: number) => {
		dispatch({ type: "REMOVE_ANNOTATION_FROM_ANNOTATED_TEXT", annotationIndex })
	}

	const getFootnotes = (annotationIds: Array<number>) => {
		return state.annotations
			.filter(annotation => annotationIds.includes(annotation.id))
			.filter(annotation => annotation.type === "footnote")
			.map(annotation => (annotation as Footnote).text)
			.join("\n")
	}

// SUGGESTION:
// - have contentEditable on the <p> element ONLY when navigating using arrow keys, or selection use arrow keys or mouse
// - have only contentEditable on all <span> elements when typing
//   - this makes ENTER into "inline" <br/> instead of a <div> element after the <span> element
// - contenteditable="plaintext-only" doesn't seem to work in react...
// ALT SUGGESTION:
// - can I filter out or reformat as the user is typing or pasting, or formatting?
// ALT SUGGESTION:
// - Monaco editor? https://github.com/microsoft/monaco-editor
//   - Monarch?
//   - Build a custom model for combination of markdown, mermaid, annotated text etc.?

	return (
		<>
			<div className="annotated-text-editor">
				<p ref={textNode} contentEditable={false}>
					{
						state.segments.map((segment, segmentIndex) =>
							<span key={segmentIndex}
								contentEditable={true}
								className={classNames({ "segment": true, "highlight": segment.annotationIds.length > 0 })}
								title={getFootnotes(segment.annotationIds)}
								data-segment-index={segmentIndex}
							>
								{segment.text}
							</span>
						)}
				</p>
				{/* <ReactMarkdown>{state.segments.map(segment => segment.text).join("")}</ReactMarkdown> */}
				<ol className="footnotes">
					{
						state.annotations
							.filter(annotation => annotation.type === "footnote")
							.map(annotation => annotation as Footnote)
							.map((footnote, ix) => <li key={ix}>{footnote.text} <button className="linkbutton" onClick={e => remove(ix)}>remove</button></li>)
					}
				</ol>
				<button onClick={e => clicked1()}>console.log("*** something")</button>
				<br />
				<button onClick={e => addFootnote()}>Add footnote</button>
			</div>
		</>
	)
}


function getTextBetweenSplitPoints(segments: Array<Segment>, fromSplitPoint: SplitPoint, toSplitPoint: SplitPoint): string {
	const [firstSplitPoint, lastSplitPoint] = [fromSplitPoint, toSplitPoint].sort(segmentComparer)

	const firstSegment = segments[firstSplitPoint.segmentIndex]
	const lastSegment = segments[lastSplitPoint.segmentIndex]

	if (firstSplitPoint.segmentIndex === lastSplitPoint.segmentIndex) {
		return firstSegment.text.slice(firstSplitPoint.charPos, lastSplitPoint.charPos)
	} else {
		return [
			firstSegment.text.slice(firstSplitPoint.charPos),
			...segments.slice(firstSplitPoint.segmentIndex + 1, lastSplitPoint.segmentIndex).map(segment => segment.text),
			lastSegment.text.slice(0, lastSplitPoint.charPos)
		].join("")
	}
}

