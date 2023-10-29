import { Agenda } from "./types"
import { initialAgenda } from "../AgendaEditorContext"
import { LOCATION_ACTION, locationReducer } from "./LocationReducer"
import { TIMESLOT_ACTION, timeslotReducer } from "./TimeslotReducer"
import { SESSION_ACTION, sessionReducer } from "./SessionReducer"
import { BREAK_ACTION, breakReducer } from "./BreakReducer"

export type ACTION = LOCATION_ACTION | TIMESLOT_ACTION | SESSION_ACTION | BREAK_ACTION

export function agendaReducer(state: Agenda = initialAgenda, action: ACTION) {
	state = locationReducer(state, action)
	state = timeslotReducer(state, action)
	state = sessionReducer(state, action)
	state = breakReducer(state, action)
	return state
}