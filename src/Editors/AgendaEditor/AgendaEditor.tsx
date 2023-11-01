import React, { useContext } from "react"
import "./AgendaEditor.css"
import { LocationsRow } from "./LocationsRow"
import { AgendaEditorContext, initialAgenda } from "./AgendaEditorContext"
import { ACTION, agendaReducer } from "./Reducers/AgendaReducer"
import { TimeslotRows } from "./TimeslotRows"
import { useContentReducer } from "../../Metamory/useContentReducer"
import { sessions, speakers, tags } from "./SessionData"


export const AgendaEditor = () => {
    const [state, dispatch] = useContentReducer<any, ACTION>(agendaReducer, initialAgenda)

    const agendaContext = {
        state,
        dispatch
    }

    return (
        <div className="frame AgendaEditor">
            <AgendaEditorContext.Provider value={agendaContext}>
                <AgendaEditorInner />
            </AgendaEditorContext.Provider>
            <SessionList />
        </div>
    )
}

const SessionList = () => {
    return (
        <div>
            <h3>Sessions</h3>
            {
                sessions.map(session => (
                    <div key={session.id}>
                        <div>
                            {sessions[session.id].title}
                        </div>
                        <div>
                            {sessions[session.id].speakers.map((speaker, index) => <span key={index}>{speakers[speaker.id].name}</span>)}
                        </div>
                        <div className="tags">
                            {sessions[session.id].tags.map((tag, index) => <span key={index} className="tag">{tags[tag.id].name}</span>)}
                        </div>
                    </div>))
            }
        </div>
    )
}

AgendaEditor.mimeType = "application/agenda+json"

const AgendaEditorInner = () => {
    const { dispatch, state } = useContext(AgendaEditorContext)

    return (
        <>
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
        </>
    )
}
