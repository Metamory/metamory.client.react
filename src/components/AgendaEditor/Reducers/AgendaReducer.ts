import { Agenda } from "../Agenda"
import { initialAgenda } from "../AgendaEditorContext"
import { LOCATION_ACTION, locationReducer } from "./LocationReducer"
import { SESSION_ACTION, sessionReducer } from "./SessionReducer"
import { TIMESLOT_ACTION, timeslotReducer } from "./TimeslotReducer"

export type ACTION = LOCATION_ACTION | SESSION_ACTION | TIMESLOT_ACTION

export function agendaReducer(state: Agenda = initialAgenda, action: ACTION) {
	state = locationReducer(state, action)
	state = sessionReducer(state, action)
	state = timeslotReducer(state, action)
	return state
}