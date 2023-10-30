import { maxBy } from "../../../components/max"
import { Agenda } from "./types"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"
import { moveInArray, removeAtIndex } from "../../../components/array-helpers"


export type TIMESLOT_ACTION =
    | { type: "ADD_BREAKOUTSESSION" }
    | { type: "ADD_BREAK", title: string }
    | { type: "ADD_KEYNOTE" }
    | { type: "CHANGE_TIMESLOT_DURATION", timeslotIndex: number, duration: number }
    | { type: "REMOVE_TIMESLOT", timeslotIndex: number }
    | { type: "MOVE_TIMESLOT", fromTimeslotIndex: number, toTimeslotIndex: number }

    
export function timeslotReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
    switch (action.type) {
        case "ADD_BREAKOUTSESSION":
            return {
                ...state,
                timeslots: [...state.timeslots, {
                    id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                    duration: 60,
                    timeslotType: "breakout",
                    sessions: state.locations.map(
                        () => ({
                            "id": null
                        })
                    )
                }]
            }
            //TODO: adjust start and end times

        case "ADD_BREAK":
            return {
                ...state,
                timeslots: [...state.timeslots, {
                    id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                    duration: 20,
                    timeslotType: "break",
                    title: action.title
                }],
            }
            //TODO: adjust start and end times

        case "ADD_KEYNOTE":
            return {
                ...state,
                timeslots: [...state.timeslots, {
                    id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                    duration: 60,
                    timeslotType: "keynote",
                    sessions: [{
                        id: null
                    }]
                }]
            }
            //TODO: adjust start and end times

        case "CHANGE_TIMESLOT_DURATION":
            return {
                ...state,
                timeslots: [...state.timeslots.slice(0, action.timeslotIndex), {
                    ...state.timeslots[action.timeslotIndex],
                    duration: action.duration
                }, ...state.timeslots.slice(action.timeslotIndex + 1)]
            }
            //TODO: adjust start and end times

        case "REMOVE_TIMESLOT":
            return {
                ...state,
                timeslots: removeAtIndex(state.timeslots, action.timeslotIndex)
            }
            //TODO: adjust start and end times

        case "MOVE_TIMESLOT":
            return {
                ...state,
                timeslots: moveInArray(state.timeslots, action.fromTimeslotIndex, action.toTimeslotIndex)
            }
            //TODO: adjust start and end times

        default:
            return state
    }
}