import { reducerFn } from "./useContentReducer"

type State = {
	contentId: string
	content: any
	contentType?: string
	currentVersionId?: string
	versions: Version[]
	publishedVersionId?: string
	draft?: {
		version: Version
		content: any
		contentType?: string
	}
}

export const initialState: State = {
	contentId: "",
	content: undefined,
	contentType: "text/plain",
	currentVersionId: undefined,
	versions: [],
	publishedVersionId: undefined,
	draft: undefined
}

export type Version = {
	author: string
	label: string
	previousVersionId?: string
	timestamp: string
	versionId: string
}

export const DRAFT = "DRAFT"

//---
const emptyReducer: reducerFn<any, any> = (state, _) => state

let contentReducer = emptyReducer
export const _setContentReducer = (reducer: reducerFn<unknown, unknown>) => {
	contentReducer = reducer
}
//---

type Action =
	| { type: "VERSIONS_LOADED"; versions: Version[]; publishedVersionId?: string }
	| { type: "LOADING"; contentId: string }
	| { type: "LOADED"; content: any; contentType?: string }
	| { type: "SAVED"; newlyCreatedVersion: Version }
	| { type: "PUBLISHED"; publishedVersionId: string }
	| { type: "CURRENT_VERSION_CHANGED"; currentVersionId: string }
	| { type: "CONTENT_TYPE_CHANGED"; contentType: string }
	| { type: "ENTER_DRAFT_MODE"; currentUser: string }
	| { type: "DRAFT_CONTENT_CHANGED"; draftContent: any }
	| { type: "DISPATCH_ON_CONTENT"; action: any }

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "VERSIONS_LOADED":
			const newestVersionId =
				action.versions.length === 0 ? undefined : action.versions[action.versions.length - 1]?.versionId
			return {
				...state,
				versions: action.versions,
				publishedVersionId: action.publishedVersionId,
				currentVersionId: action.publishedVersionId ?? newestVersionId
			}

		case "LOADING":
			return {
				...initialState,
				contentId: action.contentId,
				// content: undefined,
				// contentType: undefined
			}

		case "LOADED":
			return {
				...state,
				content: action.content,
				contentType: action.contentType
			}

		case "SAVED":
			return {
				...state,
				versions: [...state.versions, action.newlyCreatedVersion],
				currentVersionId: action.newlyCreatedVersion.versionId,
				draft: undefined
			}

		case "PUBLISHED":
			return {
				...state,
				publishedVersionId: action.publishedVersionId
			}

		case "CURRENT_VERSION_CHANGED":
			return {
				...state,
				currentVersionId: action.currentVersionId
			}

		case "ENTER_DRAFT_MODE":
			//TODO: To be removed when DRAFT mode is automatically entered below
			const draftVersion = {
				author: action.currentUser,
				label: "",
				previousVersionId: state.currentVersionId,
				timestamp: "",
				versionId: DRAFT
			}
			return {
				...state,
				currentVersionId: draftVersion.versionId,
				draft: {
					version: draftVersion,
					content: state.content,
					contentType: state.contentType
				}
			}

		case "CONTENT_TYPE_CHANGED":
			//TODO: implement automatic entering DRAFT mode if not alread in DRAFT mode
			return {
				...state,
				draft: state.draft && {
					...state.draft,
					contentType: action.contentType
				}
			}

		case "DRAFT_CONTENT_CHANGED":
			//TODO: implement automatic entering DRAFT mode if not alread in DRAFT mode
			return {
				...state,
				draft: state.draft && {
					...state.draft,
					content: action.draftContent
				}
			}

		case "DISPATCH_ON_CONTENT":
			console.log("*** DISPATCH_ON_CONTENT - This should enter into draftmode...")
			const contentAction = action.action
			const content = contentReducer(state.content, contentAction)

			return {
				...state,
				//TODO: How to enter draft mode???
				draft: state.draft && {
					...state.draft,
					content: content
				},
				content: content
			}
	}
}
