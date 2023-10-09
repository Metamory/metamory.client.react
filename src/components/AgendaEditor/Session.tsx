import React, { useContext } from "react";
import { SessionId } from "./Agenda";
import { AgendaEditorContext } from "./AgendaEditorContext";
import {sessions, speakers, tags} from "./SessionData"


const EmptySlot = () => (
    <div className="empty-slot"></div>
)

const NonEmptySlot = ({ session }: SessionSlotProps) => {
    const { dispatch } = useContext(AgendaEditorContext)
    
    if(session.id === undefined || session.id === null){
        throw new Error("impossible");
    }
    return (
        <div>
            <button className="icons" onClick={() => console.log("Clear session is not yet implemented")}>
                &times;
            </button>
            <div>
                {sessions[session.id].title}
            </div>
            <div>
                {sessions[session.id].speakers.map((speaker, index) => <span key={index}>{speakers[speaker.id].name}</span>)}
            </div>
            <div className="tags">
                {sessions[session.id].tags.map((tag, index) => <span key={index} className="tag">{tags[tag.id].name}</span>)}
            </div>
        </div>
    )
}

type SessionSlotProps = {
    session: SessionId
}

export const SessionSlot = ({ session } : SessionSlotProps) => (
    session.id != null && session.id !== undefined ? <NonEmptySlot session={session} /> : <EmptySlot />
)
