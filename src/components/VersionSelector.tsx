import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export const VersionSelector = () => {
	const metamoryContext = useContext(MetamoryContext)

	return (
		<div>
			Available versions:
			<select
				onChange={(event) => {
					metamoryContext.changeVersion(event.currentTarget.value)
				}}
				value={metamoryContext.currentVersionId}
			>
				{metamoryContext.versions.map((version, ix) => (
					<option key={ix} value={version.versionId}>
						{version.versionId === metamoryContext.publishedVersionId && "* "}
						{version.versionId} {version.label !== "" ? version.label : ""} ({version.author})
					</option>
				))}
			</select>
		</div>
	)
}
