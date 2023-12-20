import { Agenda, SessionId, Timeslot, TimeslotWithSessions } from "./types"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"
import { changeAtIndex } from "../../../components/array-helpers"


export type SESSION_ACTION =
    | { type: "SWAP_SESSION", fromTimeslotIndex: number, fromLocationIndex: number, toTimeslotIndex: number, toLocationIndex: number }
    | { type: "CLEAR_SESSION", timeslotIndex: number, locationIndex: number }
    | { type: "SET_SESSION", timeslotIndex: number, locationIndex: number, sessionId: number }


export function sessionReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
    switch (action.type) {
        case "SWAP_SESSION": {
            const fromTimeslot = state.timeslots[action.fromTimeslotIndex] as TimeslotWithSessions
            const fromSession = fromTimeslot.sessions[action.fromLocationIndex]
            const toTimeslot = state.timeslots[action.toTimeslotIndex] as TimeslotWithSessions
            const toSession = toTimeslot.sessions[action.toLocationIndex]

            let timeslots = state.timeslots
            timeslots = createTimeslotsWithChangedSession(timeslots, action.toTimeslotIndex, action.toLocationIndex, fromSession)
            timeslots = createTimeslotsWithChangedSession(timeslots, action.fromTimeslotIndex, action.fromLocationIndex, toSession)

            return {
                ...state,
                timeslots
            }
        }

        case "CLEAR_SESSION": {
            return {
                ...state,
                timeslots: createTimeslotsWithChangedSession(state.timeslots, action.timeslotIndex, action.locationIndex, { id: null })
            }
        }

        case "SET_SESSION": {
            return {
                ...state,
                timeslots: createTimeslotsWithChangedSession(state.timeslots, action.timeslotIndex, action.locationIndex, { id: action.sessionId })
            }
        }

        default:
            return state
    }
}

const createTimeslotsWithChangedSession = (timeslots: Array<Timeslot>, timeslotIndex: number, locationIndex: number, sessionId: SessionId): Array<Timeslot> => {
    const replacementFn = (timeslot: Timeslot) => (
        {
            ...timeslot,
            sessions: changeAtIndex((timeslot as TimeslotWithSessions).sessions, locationIndex, { ...sessionId })
        }
    )

    return changeAtIndex(timeslots, timeslotIndex, replacementFn)
}



