import React, { useEffect, useReducer } from "react"
import { reducer, initialState, DRAFT, Version } from "./MetamoryReducer"

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
	changeContent: (content: string) => {},
	changeContentType: (mimeType: string) => {}
}

export const MetamoryContext = React.createContext(defaultMetamoryContext)

type MetamoryProps = {
	serviceBaseUrl: string
	siteName: string
	contentId: string
	currentUser: string
	children?: React.ReactNode
}

export const Metamory = ({ serviceBaseUrl, siteName, currentUser, children, ...props }: MetamoryProps) => {
	const [state, dispatch] = useReducer(reducer, { ...initialState, contentId: props.contentId })

	useEffect(() => {
		// load content
		if (state.currentVersionId === undefined || state.currentVersionId === DRAFT) {
			dispatch({ type: "LOADED", content: state.draft?.content, contentType: state.draft?.contentType })
			return
		}

		fetch(`${serviceBaseUrl}/content/${siteName}/${state.contentId}/${state.currentVersionId}`)
			.then((response) => {
				return Promise.all([response.text(), response.headers.get("Content-Type")!])
			})
			.then(([content, contentType]) => {
				dispatch({ type: "LOADED", content, contentType })
			})
	}, [
		serviceBaseUrl,
		siteName,
		state.contentId,
		state.currentVersionId,
		state.draft?.content,
		state.draft?.contentType
	])

	useEffect(() => {
		// load versions
		fetch(`${serviceBaseUrl}/content/${siteName}/${state.contentId}/versions`)
			.then((response) => response.json())
			.then((data) => {
				dispatch({
					type: "VERSIONS_LOADED",
					versions: data.versions,
					publishedVersionId: data.publishedVersionId
				})
			})
	}, [serviceBaseUrl, siteName, state.contentId])

	const load = (contentId: string) => {
		dispatch({ type: "LOADING", contentId })
	}

	const save = (content: string, label: string) => {
		const body = {
			previousVersionId: state.draft?.version!.previousVersionId,
			content,
			label,
			contentType: state.draft?.contentType,
			author: currentUser
		}
		fetch(`${serviceBaseUrl}/content/${siteName}/${state.contentId}`, {
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
				dispatch({ type: "SAVED", newlyCreatedVersion })
			})
	}

	const publish = (versionId: string, startDate: string /* ISO 8601 date/time */) => {
		const body = {
			status: "Published",
			startDate, // ISO 8601 date/time for publication
			responsible: currentUser
		}
		fetch(`${serviceBaseUrl}/content/${siteName}/${state.contentId}/${versionId}/status`, {
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
				dispatch({ type: "PUBLISHED", publishedVersionId: data.publishedVersionId })
			})
	}

	const changeVersion = (versionId: string) => {
		dispatch({ type: "CURRENT_VERSION_CHANGED", currentVersionId: versionId })
	}

	const changeContent = (content: string) => {
		if (state.currentVersionId !== DRAFT) {
			dispatch({ type: "ENTER_DRAFT_MODE", currentUser })
		}
		dispatch({ type: "DRAFT_CONTENT_CHANGED", draftContent: content })
	}

	const changeContentType = (mimeType: string) => {
		if (state.currentVersionId !== DRAFT) {
			dispatch({ type: "ENTER_DRAFT_MODE", currentUser })
		}
		dispatch({ type: "CONTENT_TYPE_CHANGED", contentType: mimeType })
	}

	const context = {
		contentId: state.contentId,
		contentType: state.currentVersionId === DRAFT ? state.draft?.contentType : state.contentType,
		content: state.currentVersionId === DRAFT ? state.draft?.content : state.content,
		versions: state.draft !== undefined ? [...state.versions, state.draft.version] : state.versions,
		currentVersionId: state.currentVersionId,
		publishedVersionId: state.publishedVersionId,
		load,
		save,
		publish,
		changeVersion,
		changeContent,
		changeContentType
	}

	return <MetamoryContext.Provider value={context}>{children}</MetamoryContext.Provider>
}
