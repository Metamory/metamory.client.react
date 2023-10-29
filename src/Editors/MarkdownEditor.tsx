import React, { useContext } from "react"
import "./MarkdownEditor.css"
import ReactMarkdown from "react-markdown"
import { MetamoryContext } from "../Metamory/Metamory"

export const MarkdownEditor = () => {
	const metamoryContext = useContext(MetamoryContext)

	return (
		<div className="frame MarkdownEditor">
			<div className="top">Content type: {metamoryContext.contentType}</div>
			<textarea
				className="left"
				value={metamoryContext.content}
				onChange={(event) => {
					metamoryContext.changeContent(event.currentTarget.value)
				}}
			></textarea>
			<div className="right">
				<ReactMarkdown>{metamoryContext.content}</ReactMarkdown>
			</div>
		</div>
	)
}

MarkdownEditor.mimeType = "text/markdown"
