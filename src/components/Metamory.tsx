import React, { useEffect } from "react"

export const MetamoryContext = React.createContext<MetamoryData | undefined>(undefined)

type MetamoryData = {
	contentId: string
	contentType?: string
	content?: any
	versions: Version[]
	currentVersionId?: string
	publishedVersionId?: string
	load: (contentId: string) => void
	save: (content: string, label: string) => void
	publish: (versionId: string, from: string) => void // from is the ISO date/time instant
	changeVersion: (versionId: string) => void
	changeContent: (content: string) => void
}

type Version = {
	author: string
	label: string
	previousVersionId: string
	timestamp: string
	versionId: string
}

type MetamoryProps = {
	serviceBaseUrl: string
	siteName: string
	contentId: string
	contentType: string
	children?: React.ReactNode
}

export const Metamory = ({ serviceBaseUrl, siteName, children, ...props }: MetamoryProps) => {
	const [contentId, setContentId] = React.useState(props.contentId)
	const [content, setContent] = React.useState<string | undefined>(undefined)
	const [contentType, setContentType] = React.useState<string | undefined>(undefined)
	const [currentVersionId, setCurrentVersionId] = React.useState<string | undefined>(undefined)
	const [versions, setVersions] = React.useState<Version[]>([])
	const [publishedVersionId, setPublishedVersionId] = React.useState<string | undefined>(undefined)

	useEffect(() => {
		if (currentVersionId === undefined) return

		fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}/${currentVersionId}`)
			.then((response) => {
				setContentType(response.headers.get("Content-Type")!)
				return response.text()
			})
			.then((data) => {
				setContent(data)
			})
	}, [serviceBaseUrl, siteName, contentId, currentVersionId])

	useEffect(() => {
		fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}/versions`)
			.then((response) => response.json())
			.then((data) => {
				setVersions(data.versions)
				setPublishedVersionId(data.publishedVersionId)
				setCurrentVersionId(data.publishedVersionId ?? data.versions[0]?.versionId)
			})
	}, [serviceBaseUrl, siteName, contentId])

	const context = {
		contentId,
		contentType,
		content,
		versions,
		currentVersionId,
		publishedVersionId,
		load: (contentId: string) => {
			setContentId(contentId)
		},
		save: (content: string, label: string) => {
			const body = {
				previousVersionId,
				content,
				label,
				contentType
			}
			const headers = {
				"Content-Type": "application/json"
			}
			fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}`, {
				method: "POST",
				mode: "cors",
				cache: "no-cache",
				headers,
				body: JSON.stringify(body)
			})
				.then((response) => response.json())
				.then((newlyCreatedVersion) => {
					setVersions([...versions, newlyCreatedVersion])
					setCurrentVersionId(newlyCreatedVersion.versionId)
					// setDraftVersion(undefined); //TODO
				})
		},
		publish: (versionId: string, startDate: string /* ISO 8601 date/time */) => {
			const body = {
				status: "Published",
				startDate, // ISO 8601 date/time for publication
				responsible: "--not implemented--" //TODO: username or author
			}
			const headers = {
				"Content-Type": "application/json"
			}
			fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}/${versionId}/status`, {
				method: "POST",
				mode: "cors",
				cache: "no-cache",
				headers,
				body: JSON.stringify(body)
			})
				.then((response) => response.json())
				.then((data) => {
					setPublishedVersionId(data.publishedVersionId)
				})
		},
		changeVersion: (versionId: string) => {
			setCurrentVersionId(versionId)
		},
		changeContent: (content: string) => {
			setContent(content)
		}
	}

	return <MetamoryContext.Provider value={context}>{children}</MetamoryContext.Provider>
}
