import React, { useContext, useReducer } from "react"
import "./AgendaEditor.css"
import { MetamoryContext } from "../Metamory"
import { Locations } from "./Locations"
import { AgendaEditorContext, initialAgenda } from "./AgendaEditorContext"
import { agendaReducer } from "./Reducers/AgendaReducer"
import { Timeslots } from "./Timeslots"


export const AgendaEditor = () => {
    const metamoryContext = useContext(MetamoryContext)

    //TODO: When wrapReducer is working, place it on the metamoryContext!!!
    const wrapReducer = <TState, TAction>(reducer: (state: TState, action: TAction) => TState) => (state: TState, action: TAction) => {
        const newState = reducer(state, action)
        metamoryContext.changeContent(JSON.stringify(newState))
        return newState
    }

    //const [state, dispatch] = useReducer(wrapReducer(agendaReducer), metamoryContext.content ?? initialAgenda)
    const [state, dispatch] = useReducer(agendaReducer, metamoryContext.content )

    const agendaContext = {
        state,
        dispatch
    }

    return (
        <AgendaEditorContext.Provider value={agendaContext}>
            <AgendaEditorInner />
        </AgendaEditorContext.Provider>
    )
}

AgendaEditor.mimeType = "application/agenda+json"

const AgendaEditorInner = () => {
    const { dispatch, state } = useContext(AgendaEditorContext)



    return (
        <div className="frame AgendaEditor">
            <button onClick={() => dispatch({ type: "ADD_LOCATION" })}>Add location</button>
            <br />
            <br />
            <button onClick={() => dispatch({ type: "ADD_KEYNOTE" })}>Add Keynote</button>
            <button onClick={() => dispatch({ type: "ADD_BREAKOUTSESSION" })}>Add Breakout</button>
            <button onClick={() => dispatch({ type: "ADD_BREAK", title: "Break" })}>Add Break</button>
            <br />
            <br />

            <table>
                <thead>
                    <Locations />
                </thead>
                <tfoot>
                    <Locations />
                </tfoot>
                {/* <tbody> */}
                    <Timeslots />
                {/* </tbody> */}
            </table>


            {/* <button onClick={() => console.log("--save--", state)}>SAVE inside AGENDA-EDITOR</button> */}

            {/* <textarea
				value={metamoryContext.content}
				onChange={(event) => {
					metamoryContext.changeContent(event.currentTarget.value)
				}}
			></textarea> */}
        </div>
    )
}