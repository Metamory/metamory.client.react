import React from "react"
import { Agenda } from "./Agenda"
import { ACTION } from "./Reducers/AgendaReducer"




export const initialAgenda : Agenda = {
    start: "2023-01-01T09:00:00+02:00",
    locations: [],
    timeslots: [],
}

type agendaContext = {
    state: Agenda
    dispatch: (message: ACTION) => void
}

export const AgendaEditorContext = React.createContext<agendaContext>({state: initialAgenda, dispatch: (message: ACTION) => {}})

