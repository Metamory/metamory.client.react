import React, { useContext } from "react"
import "./MarkdownEditor.css"
import ReactMarkdown from "react-markdown"
import { MetamoryContext } from "./Metamory"

export const MarkdownEditor = () => {
	const metamoryContext = useContext(MetamoryContext)

	return (
		<div className="MarkdownEditor">
			Content type: {metamoryContext.contentType}
			<br />
			Content
			<br />
			<textarea
				value={metamoryContext.content}
				style={{ width: "calc(100% - .5em)" }}
				onChange={(event) => {
					metamoryContext.changeContent(event.currentTarget.value)
				}}
			></textarea>
			<ReactMarkdown>{metamoryContext.content}</ReactMarkdown>
		</div>
	)
}
