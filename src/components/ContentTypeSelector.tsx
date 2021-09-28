import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export const ContentTypeSelector = () => {
	const metamoryContext = useContext(MetamoryContext)
	const mimeTypes = ["text/plain", "text/markdown", "application/json"]

	return (
		<div className="frame">
			Available versions:
			<select
				onChange={(event) => {
					metamoryContext.changeContentType(event.currentTarget.value)
				}}
				value={metamoryContext.contentType}
			>
				{mimeTypes.map((mimeType, ix) => (
					<option key={ix} value={mimeType}>
						{mimeType}
					</option>
				))}
			</select>
		</div>
	)
}
