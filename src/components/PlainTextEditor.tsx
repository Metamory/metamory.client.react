import React, { useContext } from "react"
import "./PlainTextEditor.css"
import { MetamoryContext } from "./Metamory"

export const PlainTextEditor = () => {
	const metamoryContext = useContext(MetamoryContext)

	return (
		<div className="frame PlainTextEditor">
			<div className="top">Content type: {metamoryContext.contentType}</div>
			<textarea
				value={metamoryContext.content}
				onChange={(event) => {
					metamoryContext.changeContent(event.currentTarget.value)
				}}
			></textarea>
		</div>
	)
}

PlainTextEditor.mimeType = "text/plain"