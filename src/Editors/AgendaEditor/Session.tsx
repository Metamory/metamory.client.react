import { useContext } from "react"
import { SessionId } from "./Reducers/types"
import { AgendaEditorContext } from "./AgendaEditorContext"
import { sessions, speakers, tags } from "./SessionData"
import { useDrag } from "../../components/DragDropHelpers/useDrag"
import { useDrop } from "../../components/DragDropHelpers/useDrop"
import { MimeTypeConverterArray } from "../../components/DragDropHelpers/types"


type SessionIndex = {
    timeslotIndex: number
    locationIndex: number
}

const mimeTypeConverters: MimeTypeConverterArray<SessionId, SessionIndex> = [
    {
        mimeType: "application/agenda-session+index+json",
        convertDragDataToPayload: (_, { timeslotIndex, locationIndex }) => ({ index: { timeslotIndex, locationIndex } }),
        convertDropPayloadToAction: (fromIndex, toIndex, _) => ({
            type: "SWAP_SESSION",
            fromTimeslotIndex: fromIndex.timeslotIndex,
            fromLocationIndex: fromIndex.locationIndex,
            toTimeslotIndex: toIndex.timeslotIndex,
            toLocationIndex: toIndex.locationIndex,
        })
    },
    {
        mimeType: "application/agenda-session+json",
        convertDropPayloadToAction: (_, toIndex, session) => ({
            type: "SET_SESSION",
            timeslotIndex: toIndex.timeslotIndex,
            locationIndex: toIndex.locationIndex,
            sessionId: session.id
        })
    },
    {
        mimeType: "text/plain",
        convertDragDataToPayload: (session, _) => `session id: ${session.id}`,
    }
]

type EmptySlotProps = {
    timeslotIndex: number
    locationIndex: number
}


const EmptySlot = ({ timeslotIndex, locationIndex }: EmptySlotProps) => {
    const { dispatch } = useContext(AgendaEditorContext)
    const droppable = useDrop(mimeTypeConverters, dispatch)

    return (
        <div className="empty-slot"
            onDrop={droppable.handleDrop({ timeslotIndex, locationIndex })}
            onDragOver={droppable.dragOver({ timeslotIndex, locationIndex })}
        >
            <div className="frame"></div>
        </div>
    )
}


const NonEmptySlot = ({ session, timeslotIndex, locationIndex }: SessionSlotProps) => {
    const { dispatch } = useContext(AgendaEditorContext)
    const droppable = useDrop(mimeTypeConverters, dispatch)
    const draggable = useDrag(mimeTypeConverters)

    if (session.id === undefined || session.id === null) {
        throw new Error("impossible")
    }

    return (
        <div
            draggable={true}
            // onMouseDown={e => dnd.mouseDown(e)}
            // onMouseUp={e => dnd.mouseUp(e)}
            onDragStart={draggable.dragStart({ timeslotIndex, locationIndex }, session)}
            onDragOver={droppable.dragOver({ timeslotIndex, locationIndex })}
            onDragEnd={draggable.dragEnd}
            onDrop={droppable.handleDrop({ timeslotIndex, locationIndex })}
        >
            <div>
                <div className="icons" >
                    <button onClick={() => dispatch({ type: "CLEAR_SESSION", timeslotIndex, locationIndex })}>
                        &times;
                    </button>
                </div>
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
        </div>
    )
}


type SessionSlotProps = {
    session: SessionId
    timeslotIndex: number
    locationIndex: number
}

export const SessionSlot = ({ session, timeslotIndex, locationIndex }: SessionSlotProps) => (
    session.id != null && session.id !== undefined
        ? <NonEmptySlot session={session} timeslotIndex={timeslotIndex} locationIndex={locationIndex} />
        : <EmptySlot timeslotIndex={timeslotIndex} locationIndex={locationIndex} />
)
