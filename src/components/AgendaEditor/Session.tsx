import React, { useContext, useState } from "react";
import { SessionId } from "./Agenda";
import { AgendaEditorContext } from "./AgendaEditorContext";
import { sessions, speakers, tags } from "./SessionData"


type EmptySlotProps = {
    timeslotIndex: number
    locationIndex: number
}

const EmptySlot = ({ timeslotIndex, locationIndex }: EmptySlotProps) => (
    // const droppable = useDrop()
    <div className="empty-slot"></div>
)

const NonEmptySlot = ({ session, timeslotIndex, locationIndex }: SessionSlotProps) => {
    const { state, dispatch } = useContext(AgendaEditorContext)
    // const draggable = useDrag()
    // const droppable = useDrop()

    if (session.id === undefined || session.id === null) {
        throw new Error("impossible");
    }

    const mimeTypeConverters: { mimeType: string; fn: (data: SessionId, timeslotIndex: number, locationIndex: number) => string }[] = [
        { mimeType: "application/agenda+session-move+json", fn: (data, timeslotIndex, locationIndex) => JSON.stringify({timeslotIndex, locationIndex}) },
        { mimeType: "text", fn: (data, timeslotIndex, locationIndex) => `session id: ${session.id} (timeslot index: ${timeslotIndex}, location index: ${locationIndex}})` }
    ]
    const defaultMimeType = mimeTypeConverters[0].mimeType

    const dragStart = (timeslotIndex: number, locationIndex: number, data: SessionId) => (event: React.DragEvent) => {
        mimeTypeConverters.forEach(converter => {
            event.dataTransfer.setData(converter.mimeType, converter.fn(data, timeslotIndex, locationIndex))
        })
        event.dataTransfer.effectAllowed = "move"
        const x = event.clientX - event.currentTarget.getBoundingClientRect().left
        event.dataTransfer.setDragImage(event.currentTarget, x, event.currentTarget.clientHeight / 2)
        event.stopPropagation()
    }

    const dragEnd = (event: React.DragEvent) => {
    }

    const dragOver = (timeslotIndex: number, locationIndex: number) => (event: React.DragEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.dataTransfer.types.includes(defaultMimeType)) {
            event.dataTransfer.dropEffect = "move"
        } else {
            event.dataTransfer.dropEffect = "none"
        }
    }

    const handleDrop = (toTimeslotIndex: number, toLocationIndex: number) => (event: React.DragEvent) => {
        event.preventDefault()
        if (!event.dataTransfer.types.includes(defaultMimeType)) {
            return
        }

        const { timeslotIndex: fromTimeslotIndex, locationIndex: fromLocationIndex } = JSON.parse(event.dataTransfer.getData(defaultMimeType)) as {timeslotIndex: number, locationIndex: number}

        dispatch({type: "SWAP_SESSION", fromTimeslotIndex, fromLocationIndex, toTimeslotIndex, toLocationIndex})
    }
    
    return (
        <div
            draggable={true}
            // onMouseDown={e => dnd.mouseDown(e)}
            // onMouseUp={e => dnd.mouseUp(e)}
            onDragStart={dragStart(timeslotIndex, locationIndex, session)}
            onDragOver={dragOver(timeslotIndex, locationIndex)}
            onDragEnd={dragEnd}
            onDrop={handleDrop(timeslotIndex, locationIndex)}
        >
            <div>
                <button className="icons" onClick={() => dispatch({type: "CLEAR_SESSION", timeslotIndex, locationIndex })}>
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
