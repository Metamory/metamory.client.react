import React, { useContext } from "react"
import { MetamoryContext } from "./Metamory"

export const VersionSelector = () => {
	const metamoryContext = useContext(MetamoryContext)
	const [currentVersionId, setCurrentVersionId] = React.useState<string | undefined>(metamoryContext.currentVersionId)

	return (
		<div>
			Available versions:
			<select
				onChange={(event) => {
					setCurrentVersionId(event.currentTarget.value)
					metamoryContext.changeVersion(event.currentTarget.value)
				}}
				value={metamoryContext.currentVersionId}
			>
				{metamoryContext.versions.map((version, ix) => (
					<option key={ix} value={version.versionId}>
						{version.versionId === metamoryContext.publishedVersionId && "* "}
						{version.label !== "" ? version.label : "(No label)"} {version.versionId} ({version.author})
					</option>
				))}
			</select>
		</div>
	)
}
