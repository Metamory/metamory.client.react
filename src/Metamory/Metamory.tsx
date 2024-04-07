import React, { useEffect, useReducer } from "react"
import { reducer, initialState, DRAFT, Version, _setContentReducer } from "./MetamoryReducer"
import { reducerFn } from "./useContentReducer"

const defaultMetamoryContext = {
	contentId: "",
	contentType: undefined as string | undefined,
	content: undefined as any | undefined,
	versions: [] as Version[],
	currentVersionId: undefined as string | undefined,
	publishedVersionId: undefined as string | undefined,
	load: (contentId: string) => { },
	save: (content: string, label: string) => { },
	publish: (versionId: string, from: string) => { },
	changeVersion: (versionId: string) => { },
	changeContent: (content: string) => { },
	changeContentType: (mimeType: string) => { },
	setContentReducer: (contentReducer: reducerFn<any, any>) => { },
	dispatchOnContent: (action: any) => { } // dispatch on contentReducer (NOT on metamoryReducer)
}

export const MetamoryContext = React.createContext(defaultMetamoryContext)

type MetamoryProps = {
	serviceBaseUrl: string
	siteName: string
	contentId: string
	currentUser: string
	authHeaders: any,
	children?: React.ReactNode
}


export const Metamory = ({ serviceBaseUrl, siteName, currentUser, authHeaders, children, ...props }: MetamoryProps) => {
	const [state, dispatch] = useReducer(reducer, { ...initialState, contentId: props.contentId })

	useEffect(() => {
		// load content
		if (state.currentVersionId === undefined || state.currentVersionId === DRAFT) {
			dispatch({ type: "LOADED", content: state.draft?.content, contentType: state.draft?.contentType })
			return
		}

		fetch(`${serviceBaseUrl}/content/${siteName}/${state.contentId}/${state.currentVersionId}`,
			{
				/*mode: "cors"*/
				headers: {
					...authHeaders
				}
			})
			.then((response) => {
				const contentType = response.headers.get("Content-Type")!
				if (contentType.endsWith("/json") || contentType.endsWith("+json")) {
					return Promise.all([response.json(), contentType])
				}
				else {
					return Promise.all([response.text(), contentType])
				}
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

		fetch(`${serviceBaseUrl}/content/${siteName}/${state.contentId}/versions`,
			{
				method: "GET",
				cache: "no-cache",
				/*mode: "cors"*/
				headers: {
					...authHeaders
				}
			})
			.then((response) => response.status == 200 ? response.json() : Promise.reject(response))
			.then((data) => {
				dispatch({
					type: "VERSIONS_LOADED",
					versions: data.versions,
					publishedVersionId: data.publishedVersionId
				})
			})
			.catch(err => console.error("*** err", err))
	}, [serviceBaseUrl, siteName, state.contentId, authHeaders])

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
			// mode: "cors",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
				...authHeaders
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
			// mode: "cors",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
				...authHeaders
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

	const changeContentType = (mimeType: string) => {
		dispatch({ type: "CONTENT_TYPE_CHANGED", contentType: mimeType })
	}

	const changeContent = (content: string) => {
		dispatch({ type: "DRAFT_CONTENT_CHANGED", draftContent: content })
	}

	const setContentReducer = (reducer: reducerFn<any, unknown>) => {
		_setContentReducer(reducer)
	}

	const dispatchOnContent = (contentAction: unknown) => {
		dispatch({ type: "DISPATCH_ON_CONTENT", action: contentAction })
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
		changeContentType,
		setContentReducer,
		dispatchOnContent
	}

	return <MetamoryContext.Provider value={context}>{children}</MetamoryContext.Provider>
}
