import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export const PublishButton = () => {
	const metamoryContext = useContext(MetamoryContext)!

	return (
		<div>
			Publish from: <input /*type="datetime-local"*/ value="--not implemented yet--" disabled={true} />
			<button
				disabled={metamoryContext.currentVersionId === undefined}
				onClick={(event) =>
					metamoryContext.publish(metamoryContext.currentVersionId!, new Date().toISOString())
				}
			>
				Publish
			</button>
		</div>
	)
}
