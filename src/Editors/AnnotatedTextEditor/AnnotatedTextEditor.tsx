import React, { useContext } from "react"
import "./AnnotatedTextEditor.css"
import { ACTION, annotatedTextReducer } from "./Reducers/AnnotatedTextReducer"
import { useContentReducer } from "../../Metamory/useContentReducer"
import { AnnotatedTextEditorContext, initialAnnotatedText } from "./AnnotatedTextEditorContext"


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

const AnnotatedTextEditorInner = () => {
	const { dispatch, state } = useContext(AnnotatedTextEditorContext)

	return (
		<>
			<div className="annotated-text-editor">
				<h2>[This is AnnotatedTextEditorInner]</h2>
			</div>
		</>
	)
}
