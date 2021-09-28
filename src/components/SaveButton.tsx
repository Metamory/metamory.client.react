import React, { useContext, useState } from "react"
import { DRAFT, MetamoryContext } from "./Metamory"

export const SaveButton = () => {
	const metamoryContext = useContext(MetamoryContext)
	const [label, setLabel] = useState<string>("")

	return (
		<div className="frame">
			Label{" "}
			<input
				type="text"
				value={label}
				onChange={(event) => setLabel(event.currentTarget.value)}
				disabled={metamoryContext.currentVersionId !== DRAFT}
			/>
			<br />
			<button
				onClick={(event) => metamoryContext.save(metamoryContext.content, label)}
				disabled={metamoryContext.currentVersionId !== DRAFT}
			>
				Save
			</button>
		</div>
	)
}
