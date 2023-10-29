import React, { useContext } from "react"
import "./AgendaEditor.css"
import { LocationsRow } from "./LocationsRow"
import { AgendaEditorContext, initialAgenda } from "./AgendaEditorContext"
import { ACTION, agendaReducer } from "./Reducers/AgendaReducer"
import { TimeslotRows } from "./TimeslotRows"
import { useContentReducer } from "../../Metamory/useContentReducer"


export const AgendaEditor = () => {
    const [state, dispatch] = useContentReducer<any, ACTION>(agendaReducer, initialAgenda)

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
                    <LocationsRow />
                </thead>
                <tfoot>
                    <tr>
                        <td colSpan={state.locations.length + 2}></td>
                    </tr>
                </tfoot>
                <tbody>
                    <TimeslotRows />
                </tbody>
            </table>

            {/* <textarea
				value={metamoryContext.content}
				onChange={(event) => {
					metamoryContext.changeContent(event.currentTarget.value)
				}}
			></textarea> */}
        </div>
    )
}
