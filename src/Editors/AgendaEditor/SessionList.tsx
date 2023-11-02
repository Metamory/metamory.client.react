import React, { useState } from "react"
import { sessions, speakers, tags } from "./SessionData"
import { useDrag } from "../../components/DragDropHelpers/useDrag"
import { MimeTypeConverterArray } from "../../components/DragDropHelpers/types"
import { SessionId } from "./Reducers/types"
import classNames from "classnames"

const mimeTypeConverters: MimeTypeConverterArray<SessionId, {}> = [
    {
        mimeType: "application/agenda-session+json",
        convertDragDataToPayload: (session, _) => session
    },
    {
        mimeType: "text/plain",
        convertDragDataToPayload: (session, _) => `session id: ${session.id}`,
    }
]


export const SessionList = () => {
    const draggable = useDrag(mimeTypeConverters)
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={classNames("session-list", { "collapse-session-list": isCollapsed })}>
            <header onClick={e => setIsCollapsed(!isCollapsed)}>
                <h3>
                    Sessions
                </h3>
            </header>
            <ul>
                {sessions.map(session => (
                    <li key={session.id}
                        className="session"
                        draggable={true}
                        onDragStart={draggable.dragStart(-1, session)}
                        onDragEnd={draggable.dragEnd}
                    >
                        <div>
                            {sessions[session.id].title}
                        </div>
                        <div>
                            {sessions[session.id].speakers.map((speaker, index) => <span key={index}>{speakers[speaker.id].name}</span>)}
                        </div>
                        <div className="tags">
                            {sessions[session.id].tags.map((tag, index) => <span key={index} className="tag">{tags[tag.id].name}</span>)}
                        </div>
                    </li>))}
            </ul>
        </div>
    )
}
