import { maxBy } from "../../../max"
import { Agenda } from "../Agenda"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"
import { moveInArray, removeAtIndex } from "./array-helpers"


type ADD_BREAKOUTSESSION_ACTION = {
    type: "ADD_BREAKOUTSESSION"
}

type ADD_BREAK_ACTION = {
    type: "ADD_BREAK"
    title: string
}

type ADD_KEYNOTE_ACTION = {
    type: "ADD_KEYNOTE"
}

type CHANGE_TIMESLOT_DURATION_ACTION = {
    type: "CHANGE_TIMESLOT_DURATION"
    timeslotIndex: number
    duration: number
}

type REMOVE_TIMESLOT_ACTION = {
    type: "REMOVE_TIMESLOT"
    timeslotIndex: number
}

type MOVE_TIMESLOT_ACTION = {
    type: "MOVE_TIMESLOT"
    fromTimeslotIndex: number
    toTimeslotIndex: number
}

export type TIMESLOT_ACTION = ADD_BREAKOUTSESSION_ACTION | ADD_BREAK_ACTION | ADD_KEYNOTE_ACTION | CHANGE_TIMESLOT_DURATION_ACTION | REMOVE_TIMESLOT_ACTION | MOVE_TIMESLOT_ACTION


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
            };

        case "ADD_BREAK":
            return {
                ...state,
                timeslots: [...state.timeslots, {
					id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                    duration: 20,
                    timeslotType: "break",
                    title: action.title
                }],
            };

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
            };

        case "CHANGE_TIMESLOT_DURATION":
            return {
                ...state,
                timeslots: [...state.timeslots.slice(0, action.timeslotIndex), {
                    ...state.timeslots[action.timeslotIndex],
                    duration: action.duration
                }, ...state.timeslots.slice(action.timeslotIndex + 1)]
            };

        case "REMOVE_TIMESLOT":
            return {
                ...state,
                timeslots: removeAtIndex(state.timeslots, action.timeslotIndex)
            };

        case "MOVE_TIMESLOT":
            return {
                ...state,
                timeslots: moveInArray(state.timeslots, action.fromTimeslotIndex, action.toTimeslotIndex)
            };

        default:
            return state;
    }
}