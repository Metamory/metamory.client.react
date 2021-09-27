import React, { useEffect } from "react"

type Version = {
	author: string
	label: string
	previousVersionId?: string
	timestamp: string
	versionId: string
}

const defaultMetamoryContext = {
	contentId: "",
	contentType: undefined as string | undefined,
	content: undefined as any | undefined,
	versions: [] as Version[],
	currentVersionId: undefined as string | undefined,
	publishedVersionId: undefined as string | undefined,
	load: (contentId: string) => {},
	save: (content: string, label: string) => {},
	publish: (versionId: string, from: string) => {},
	changeVersion: (versionId: string) => {},
	changeContent: (content: string) => {}
}

export const MetamoryContext = React.createContext(defaultMetamoryContext)
export const DRAFT = "DRAFT"

type MetamoryProps = {
	serviceBaseUrl: string
	siteName: string
	contentId: string
	contentType: string
	currentUser: string
	children?: React.ReactNode
}

export const Metamory = ({ serviceBaseUrl, siteName, currentUser, children, ...props }: MetamoryProps) => {
	const [contentId, setContentId] = React.useState(props.contentId)
	const [content, setContent] = React.useState<any>(undefined)
	const [draftContent, setDraftContent] = React.useState<any>(undefined)
	const [contentType, setContentType] = React.useState<string | undefined>(undefined)
	const [currentVersionId, setCurrentVersionId] = React.useState<string | undefined>(undefined)
	const [versions, setVersions] = React.useState<Version[]>([])
	const [publishedVersionId, setPublishedVersionId] = React.useState<string | undefined>(undefined)
	const [draftVersion, setDraftVersion] = React.useState<Version | undefined>(undefined)

	useEffect(() => {
		// load content
		if (currentVersionId === undefined) return

		if (currentVersionId === DRAFT) {
			setContent(draftContent)
			return
		}

		fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}/${currentVersionId}`)
			.then((response) => {
				setContentType(response.headers.get("Content-Type")!)
				return response.text()
			})
			.then((data) => {
				setContent(data)
			})
	}, [serviceBaseUrl, siteName, contentId, currentVersionId, draftContent])

	useEffect(() => {
		// load versions
		fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}/versions`)
			.then((response) => response.json())
			.then((data) => {
				setVersions(data.versions)
				setPublishedVersionId(data.publishedVersionId)
				setCurrentVersionId(data.publishedVersionId ?? data.versions[0]?.versionId)
			})
	}, [serviceBaseUrl, siteName, contentId])

	const load = (contentId: string) => {
		setContentId(contentId)
	}

	const save = (content: string, label: string) => {
		const body = {
			previousVersionId: draftVersion!.previousVersionId,
			content,
			label,
			contentType,
			author: currentUser
		}
		fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}`, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		})
			.then((response) => response.json())
			.then((newlyCreatedVersion) => {
				setVersions([...versions, newlyCreatedVersion])
				setCurrentVersionId(newlyCreatedVersion.versionId)
				setDraftVersion(undefined)
			})
	}

	const publish = (versionId: string, startDate: string /* ISO 8601 date/time */) => {
		const body = {
			status: "Published",
			startDate, // ISO 8601 date/time for publication
			responsible: currentUser
		}
		fetch(`${serviceBaseUrl}/content/${siteName}/${contentId}/${versionId}/status`, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		})
			.then((response) => response.json())
			.then((data) => {
				setPublishedVersionId(data.publishedVersionId)
			})
	}

	const changeVersion = (versionId: string) => {
		setCurrentVersionId(versionId)
	}

	const changeContent = (content: string) => {
		setDraftContent(content)

		if (currentVersionId !== DRAFT) {
			const draftVersion = {
				author: currentUser,
				label: "",
				previousVersionId: currentVersionId,
				timestamp: "",
				versionId: DRAFT
			}
			setDraftVersion(draftVersion)
			setCurrentVersionId(draftVersion.versionId)
		}
	}

	const context = {
		contentId,
		contentType,
		content: currentVersionId === DRAFT ? draftContent : content,
		versions: draftVersion !== undefined ? [...versions, draftVersion] : versions,
		currentVersionId,
		publishedVersionId,
		load,
		save,
		publish,
		changeVersion,
		changeContent
	}

	return <MetamoryContext.Provider value={context}>{children}</MetamoryContext.Provider>
}
