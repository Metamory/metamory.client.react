import { Agenda, BreakTimeslot } from "../Agenda"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"

export type SESSION_ACTION =
    | { type: "CHANGE_BREAK_TITLE", timeslotIndex: number, title: string }
//  | { type: "CLEAR_SESSION", timeslotIndex: number, sessionIndex: number }
//  | { type: "SET_SESSION", timeslotIndex: number, sessionIndex: number, sessionId: string }

export function sessionReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
    switch (action.type) {
        case "CHANGE_BREAK_TITLE":
            return {
                ...state,
                timeslots: [
                    ...state.timeslots.slice(0, action.timeslotIndex),
                    state.timeslots[action.timeslotIndex].timeslotType === "break"
                        ? {
                            ...state.timeslots[action.timeslotIndex],
                            title: action.title
                        } as BreakTimeslot
                        : state.timeslots[action.timeslotIndex]
                    ,
                    ...state.timeslots.slice(action.timeslotIndex + 1)
                ]
            }

        // case "CLEAR_SESSION":
        //     return {
        //         ...state,
        //         timeslots: [
        //             ...state.timeslots.slice(0, action.timeslotIndex),
        //             state.timeslots[action.timeslotIndex].timeslotType === "breakout"
        //                 ? {
        //                     ...state.timeslots[action.timeslotIndex],
        //                     sessions: (state.timeslots[action.timeslotIndex] as BreakoutTimeslot).sessions[action.sessionIndex]
        //                 } as BreakoutTimeslot
        //                 : state.timeslots[action.timeslotIndex]
        //             ,
        //             ...state.timeslots.slice(action.timeslotIndex + 1)
        //         ]
        //     }

        default:
            return state
    }
}