import React, { useContext } from "react";
import { Session } from "./Agenda";
import { AgendaEditorContext } from "./AgendaEditorContext";


const EmptySlot = () => (
    <div className="empty-slot"></div>
)

const NonEmptySlot = ({ session }: SessionSlotProps) => {
    const { dispatch } = useContext(AgendaEditorContext)

    return (
        <div>
            <button className="icons" onClick={() => console.log("Clear session is not yet implemented")}>
                &times;
            </button>
            {/* <div>
                {data.sessions[session.id].title}
            </div>
            <div>
                {data.sessions[session.id].speakers.map((speaker, index) => <span key={index}>{data.speakers[speaker.id].name}</span>)}
            </div>
            <div className="tags">
                {data.sessions[session.id].tags.map((tag, index) => <span key={index} className="tag">{data.tags[tag.id].name}</span>)}
            </div> */}
        </div>
    )
}

type SessionSlotProps = {
    session: Session
}

export const SessionSlot = ({ session } : SessionSlotProps) => (
    session.id != null && session.id !== undefined ? <NonEmptySlot session={session} /> : <EmptySlot />
)
