import { maxBy } from "../../../max"
import { Agenda } from "../Agenda"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"

type ADD_LOCATION_ACTION = {
	type: "ADD_LOCATION"
}

type CHANGE_LOCATION_NAME_ACTION = {
	type: "CHANGE_LOCATION_NAME"
	locationIndex: number
	name: string

}

type REMOVE_LOCATION_ACTION = {
	type: "REMOVE_LOCATION"
	locationIndex: number
}

export type LOCATION_ACTION = ADD_LOCATION_ACTION | CHANGE_LOCATION_NAME_ACTION | REMOVE_LOCATION_ACTION


export function locationReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
	switch (action.type) {
		case "ADD_LOCATION":
			return {
				...state,
				locations: [...state.locations, {
					id: state.locations.reduce(maxBy(location => location.id), 0) + 1,
					name: "new location"
				}],
				timeslots: [...state.timeslots.map(ts => {
					switch (ts.timeslotType) {
						case "breakout":
							return {
								...ts,
								sessions: [...ts.sessions, {
									id: null
								}]
							}

						default:
							return ts
					}
				})]
			}

		case "CHANGE_LOCATION_NAME":
			return {
				...state,
				locations: [
					...state.locations.slice(0, action.locationIndex),
					{
						name: action.name,
						id: state.locations[action.locationIndex]?.id
					},
					...state.locations.slice(action.locationIndex + 1)
				]
			}

		case "REMOVE_LOCATION":
			return {
				...state,
				locations: [...state.locations.slice(0, action.locationIndex), ...state.locations.slice(action.locationIndex + 1)],
				timeslots: [...state.timeslots.map(ts => {
					switch (ts.timeslotType) {
						case "breakout":
							return {
								...ts,
								sessions: [...ts.sessions.slice(0, action.locationIndex), ...ts.sessions.slice(action.locationIndex + 1)]
							}

						default:
							return ts
					}
				})]
			}

		default:
			return state
	}
}