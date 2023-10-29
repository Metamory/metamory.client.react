import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"
import { DRAFT } from "./MetamoryReducer"

export const PublishButton = () => {
	const metamoryContext = useContext(MetamoryContext)

	return (
		<div className="frame">
			Publish from: <input /*type="datetime-local"*/ value="--not implemented yet--" disabled={true} />
			<button
				disabled={metamoryContext.currentVersionId === DRAFT}
				onClick={(event) =>
					metamoryContext.publish(metamoryContext.currentVersionId!, new Date().toISOString())
				}
			>
				Publish
			</button>
		</div>
	)
}
