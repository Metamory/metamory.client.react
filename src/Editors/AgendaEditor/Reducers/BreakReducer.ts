import { Agenda, BreakTimeslot } from "./types"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"
import { changeAtIndex } from "../../../components/array-helpers"

export type BREAK_ACTION =
    | { type: "CHANGE_BREAK_TITLE", timeslotIndex: number, title: string }

export function breakReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
    switch (action.type) {
        case "CHANGE_BREAK_TITLE":
            const timeslot = state.timeslots[action.timeslotIndex] as BreakTimeslot
            const replacement =
                {
                    ...timeslot,
                    title: action.title
                } as BreakTimeslot

            return {
                ...state,
                timeslots: changeAtIndex(state.timeslots, action.timeslotIndex, replacement)
            }

        default:
            return state
    }
}