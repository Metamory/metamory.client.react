import React, { useContext, useState } from "react"
import { MetamoryContext } from "./Metamory"

export const SaveButton = () => {
	const metamoryContext = useContext(MetamoryContext)!
	const [label, setLabel] = useState<string>("")

	return (
		<div>
			Label <input type="text" value={label} onChange={(event) => setLabel(event.currentTarget.value)} />
			<br />
			<button
				onClick={(event) => {
					metamoryContext.save(metamoryContext.content, label)
				}}
			>
				Save
			</button>
		</div>
	)
}
