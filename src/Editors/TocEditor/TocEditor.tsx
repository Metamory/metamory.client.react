import React, { useContext } from "react"
import "./TocEditor.css"
import { ACTION, tocReducer } from "./Reducers/TocReducer"
import { useContentReducer } from "../../Metamory/useContentReducer"
import { TocEditorContext, initialToc } from "./TocEditorContext"
import { TocRows } from "./TocRows"


export const TocEditor = () => {
	const [state, dispatch] = useContentReducer<any, ACTION>(tocReducer, initialToc)

	const tocEditorContext = {
		state,
		dispatch
	}

	return (
		<div className="frame toc-editor-container">
			<TocEditorContext.Provider value={tocEditorContext}>
				<TocEditorInner />
			</TocEditorContext.Provider>
		</div>
	)
}

TocEditor.mimeType = "application/table-of-contents+json"

const TocEditorInner = () => {
	const { dispatch, state } = useContext(TocEditorContext)

	return (
		<>
			<div className="toc-editor">
				<button onClick={() => dispatch({ type: "ADD_TOC_ITEM" })}>Add item</button>
				<br />
				<br />
				<table>
					<thead>
						<tr>
							<td>Table of contents</td>
						</tr>
					</thead>
					<tfoot>
						<tr>
							<td>
							</td>
						</tr>
					</tfoot>
					<tbody>
						<TocRows />
					</tbody>
				</table>
				<button onClick={() => dispatch({ type: "ADD_TOC_ITEM" })}>Add item</button>
			</div>
		</>
	)
}
