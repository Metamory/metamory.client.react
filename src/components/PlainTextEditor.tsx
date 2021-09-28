import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export const PlainTextEditor = () => {
	const metamoryContext = useContext(MetamoryContext)

	return (
		<div>
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
		</div>
	)
}
