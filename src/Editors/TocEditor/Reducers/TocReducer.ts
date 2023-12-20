
import { changeAtIndex, moveInArray, removeAtIndex } from "../../../components/array-helpers"
import { maxBy } from "../../../components/reducer-helpers"
import { initialToc } from "../TocEditorContext"
import { Toc } from "./types"

export type ACTION =
    | { type: "ADD_TOC_ITEM" }
    | { type: "CHANGE_TOC_ITEM_TITLE", tocIndex: number, title: string }
    | { type: "REMOVE_TOC_ITEM", tocIndex: number }
    | { type: "MOVE_TOC_ITEM", fromTocIndex: number, toTocIndex: number }


export function tocReducer(state: Toc = initialToc, action: ACTION) {
    switch (action.type) {
        case "ADD_TOC_ITEM": {
            const newTocItem = {
                id: state.toc.reduce(maxBy(tocItem => tocItem.id), 0) + 1,
                title: "Untitled page"
            }
            return {
                ...state,
                toc: [...state.toc, newTocItem],
            }
        }

        case "CHANGE_TOC_ITEM_TITLE": {
            const replacement = {
                title: action.title,
                id: state.toc[action.tocIndex]?.id
            }
            return {
                ...state,
                toc: changeAtIndex(state.toc, action.tocIndex, replacement)
            }
        }


        case "REMOVE_TOC_ITEM": {
            return {
                ...state,
                toc: removeAtIndex(state.toc, action.tocIndex),
            }
        }

        case "MOVE_TOC_ITEM": {
            const timeslots = moveInArray(state.toc, action.fromTocIndex, action.toTocIndex)
            return {
                ...state,
                timeslots
            }
        }

        default:
            return state
    }
}
