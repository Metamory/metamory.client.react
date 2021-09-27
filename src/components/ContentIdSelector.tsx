import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export const ContentIdSelector = () => {
	const metamoryContext = useContext(MetamoryContext)!
	const [contentId, setContentId] = React.useState(metamoryContext.contentId)
	return (
		<div>
			ContentId <input value={contentId} onChange={(event) => setContentId(event.currentTarget.value)} />
			<br />
			<button onClick={(event) => metamoryContext.load(contentId)}>Load</button>
		</div>
	)
}
