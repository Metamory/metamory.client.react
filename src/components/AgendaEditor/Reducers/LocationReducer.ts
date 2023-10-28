import { maxBy } from "../../../max"
import { Agenda } from "../Agenda"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"
import { changeAtIndex, removeAtIndex } from "./array-helpers"

export type LOCATION_ACTION =
	| { type: "ADD_LOCATION" }
	| { type: "CHANGE_LOCATION_NAME", locationIndex: number, name: string }
	| { type: "REMOVE_LOCATION", locationIndex: number }


export function locationReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
	switch (action.type) {
		case "ADD_LOCATION":
			const newLocation = {
				id: state.locations.reduce(maxBy(location => location.id), 0) + 1,
				name: "new location"
			}
			return {
				...state,
				locations: [...state.locations, newLocation],
				timeslots: [...state.timeslots.map(ts =>
					ts.timeslotType === "breakout"
						? {
							...ts,
							sessions: [...ts.sessions, { id: null }]
						}
						: ts
				)]
			}

		case "CHANGE_LOCATION_NAME":
			const replacement = {
				name: action.name,
				id: state.locations[action.locationIndex]?.id
			}

			return {
				...state,
				locations: changeAtIndex(state.locations, action.locationIndex, replacement)
			}

		case "REMOVE_LOCATION":
			return {
				...state,
				locations: removeAtIndex(state.locations, action.locationIndex),
				timeslots: [...state.timeslots.map(ts => {
					switch (ts.timeslotType) {
						case "breakout":
							return {
								...ts,
								sessions: removeAtIndex(ts.sessions, action.locationIndex)
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