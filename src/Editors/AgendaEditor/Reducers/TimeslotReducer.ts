import { maxBy } from "../../../components/reducer-helpers"
import { Agenda, BreakTimeslot, BreakoutTimeslot, KeynoteTimeslot, Timeslot } from "./types"
import { initialAgenda } from "../AgendaEditorContext"
import { ACTION } from "./AgendaReducer"
import { changeAtIndex, moveInArray, removeAtIndex } from "../../../components/array-helpers"
import { TimeOfDay } from "../../../components/TimeOfDay"


export type TIMESLOT_ACTION =
    | { type: "ADD_KEYNOTE" }
    | { type: "ADD_BREAKOUTSESSION" }
    | { type: "ADD_BREAK", title: string }
    | { type: "CHANGE_TIMESLOT_DURATION", timeslotIndex: number, duration: number }
    | { type: "REMOVE_TIMESLOT", timeslotIndex: number }
    | { type: "MOVE_TIMESLOT", fromTimeslotIndex: number, toTimeslotIndex: number }


export function timeslotReducer(state: Agenda = initialAgenda, action: ACTION): Agenda {
    switch (action.type) {
        case "ADD_KEYNOTE": {
            const newTimeslot: KeynoteTimeslot = {
                id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                duration: 60,
                from: "na",
                to: "na",
                timeslotType: "keynote",
                sessions: [{
                    id: null
                }]
            }

            const timeslots: Array<Timeslot> = [...state.timeslots, newTimeslot]
            return {
                ...state,
                timeslots: timeslots.map(recalculateFromAndTo(state.start, timeslots))
            }
        }

        case "ADD_BREAKOUTSESSION": {
            const newTimeslot: BreakoutTimeslot = {
                id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                duration: 60,
                from: "na",
                to: "na",
                timeslotType: "breakout",
                sessions: state.locations.map(
                    () => ({
                        "id": null
                    })
                )
            }

            const timeslots: Array<Timeslot> = [...state.timeslots, newTimeslot]
            return {
                ...state,
                timeslots: timeslots.map(recalculateFromAndTo(state.start, timeslots))
            }
        }

        case "ADD_BREAK": {
            const newTimeslot: BreakTimeslot = {
                id: state.timeslots.reduce(maxBy(timeslot => timeslot.id), 0) + 1,
                duration: 20,
                from: "na",
                to: "na",
                timeslotType: "break",
                title: action.title
            }
            const timeslots: Array<Timeslot> = [...state.timeslots, newTimeslot]
            return {
                ...state,
                timeslots: timeslots.map(recalculateFromAndTo(state.start, timeslots))
            }
        }

        case "CHANGE_TIMESLOT_DURATION":{
            const timeslotToChange = state.timeslots[action.timeslotIndex]
            const timeslots = changeAtIndex(state.timeslots, action.timeslotIndex, timeslot => ({
                ...timeslot,
                duration: action.duration
            }))
        return {
                ...state,
                timeslots: timeslots.map(recalculateFromAndTo(state.start, timeslots))
            }
    }

        case "REMOVE_TIMESLOT":{
            const timeslots = removeAtIndex(state.timeslots, action.timeslotIndex)
            return {
                ...state,
                timeslots: timeslots.map(recalculateFromAndTo(state.start, timeslots))
            }
        }

        case "MOVE_TIMESLOT":{
            const timeslots = moveInArray(state.timeslots, action.fromTimeslotIndex, action.toTimeslotIndex)
            return {
                ...state,
                timeslots: timeslots.map(recalculateFromAndTo(state.start, timeslots))
            }
        }

        default:
            return state
    }
}


const recalculateFromAndTo = (start: string, allTimeslots: Array<Timeslot>) => (timeslot: Timeslot, index: number) => {
    const firstTimeslotFrom = new TimeOfDay(start)
    const from = allTimeslots.slice(0, index).reduce((agg, curr) => agg.addMinutes(curr.duration), firstTimeslotFrom)

    return {
        ...timeslot,
        from: from.format("hh:mm"),
        to: from.addMinutes(timeslot.duration).format("hh:mm")
    }
}