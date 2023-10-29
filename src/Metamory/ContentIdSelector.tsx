import React, { useContext, useState } from "react"
import { MetamoryContext } from "../Metamory/Metamory"

export const ContentIdSelector = () => {
	const metamoryContext = useContext(MetamoryContext)
	const [contentId, setContentId] = useState(metamoryContext.contentId)

	return (
		<div className="frame">
			ContentId <input value={contentId} onChange={(event) => setContentId(event.currentTarget.value)} />
			<button
				onClick={(event) => metamoryContext.load(contentId)}
				disabled={contentId === metamoryContext.contentId}
			>
				Load
			</button>
		</div>
	)
}
