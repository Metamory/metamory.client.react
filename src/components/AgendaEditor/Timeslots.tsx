import React, { Fragment, useContext, useState } from "react"
import { AgendaEditorContext } from "./AgendaEditorContext"
import { BreakTimeslot, BreakoutTimeslot, KeynoteTimeslot, Timeslot } from "./Agenda"


type BeforeOrAfter = "before" | "after"

type DragOverStatus = {
    fromIndex?: number
    currentIndex?: number
    status: "none" | "top" | "bottom"
}

const emptyDragOverStatus: DragOverStatus = { status: "none" }

export const Timeslots = () => {
    const { state, dispatch } = useContext(AgendaEditorContext)

    const [dragOverStatus, setDragOverStatus] = useState<DragOverStatus>(emptyDragOverStatus)

    const locationCount = state.locations.length


    // --- Drag and Drop ---
    const dragStart = (event: React.DragEvent, index: number, timeslot: Timeslot) => {
        setDragOverStatus({
            status: "none",
            fromIndex: index,
            currentIndex: index
        })
        // TODO: replace element that is moved
        event.dataTransfer.setData("application/agenda+timeslot+json", JSON.stringify({ dataType: "timeslot", fromIndex: index }))
        event.dataTransfer.setData("text", `timeslot: ${timeslot.timeslotType} ${timeslot.duration} mins`)
        event.dataTransfer.effectAllowed = "move"

        event.dataTransfer.setDragImage(event.currentTarget, 0, event.currentTarget.clientHeight / 2)
    }

    const dragEnd = (event: React.DragEvent) => {
        setDragOverStatus(emptyDragOverStatus)
    }

    const dragOver = (event: React.DragEvent, index: number) => {
        event.preventDefault()

        const targetRect = event.currentTarget.getBoundingClientRect()
        if (event.clientY < targetRect.top + targetRect.height / 2) {
            setDragOverStatus({
                ...dragOverStatus,
                currentIndex: index,
                status: "top"
            })
        } else {
            setDragOverStatus({
                ...dragOverStatus,
                currentIndex: index,
                status: "bottom"
            })
        }

        if (event.dataTransfer.types.includes("application/agenda+timeslot+json")) {
            event.dataTransfer.dropEffect = "move"
        } else {
            event.dataTransfer.dropEffect = "none"
        }

    }

    const handleDrop = (event: React.DragEvent, index: number, dropBeforeOrAfter: BeforeOrAfter) => {
        console.log("** handleDrop", dropBeforeOrAfter, index)
        if (!event.dataTransfer.types.includes("application/agenda+timeslot+json")) {
            return
        }

        let fromTimeslotIndex = JSON.parse(event.dataTransfer.getData("application/agenda+timeslot+json")).fromIndex;
        let toTimeslotIndex = dropBeforeOrAfter === "before" ? index : index + 1;
        console.log("@@", toTimeslotIndex)
        dispatch({ type: "MOVE_TIMESLOT", fromTimeslotIndex, toTimeslotIndex })
    }

    return <tbody>
        {
            state.timeslots.map((timeslot, ix) =>
                <Fragment key={ix}>
                    <tr
                        onDragOver={e => dragOver(e, ix)}
                        style={{ display: dragOverStatus.status === "top" && dragOverStatus.currentIndex === ix && dragOverStatus.fromIndex !== ix ? "table-row" : "none" }}
                    >
                        <td colSpan={state.locations.length + 2} className="dropArea" onDrop={(event) => handleDrop(event, ix, "before")}>
                            Drag before {ix}
                        </td>
                    </tr>


                    <tr className={timeslot.timeslotType} draggable={true}
                        onDragStart={e => dragStart(e, ix, timeslot)} onDragOver={e => dragOver(e, ix)} onDragEnd={dragEnd}
                    >
                        <TimeslotRow key={timeslot.id} index={ix} timeslot={timeslot} locationCount={locationCount} />
                    </tr>


                    <tr
                        onDragOver={e => dragOver(e, ix)}
                        style={{ display: dragOverStatus.status === "bottom" && dragOverStatus.currentIndex === ix && dragOverStatus.fromIndex !== ix ? "table-row" : "none" }}
                    >
                        <td colSpan={state.locations.length + 2} className="dropArea" onDrop={(event) => handleDrop(event, ix, "after")}>
                            Drag after {ix}
                        </td>
                    </tr>
                </Fragment>)
        }
    </tbody>
}


type TimeslotRowProps = {
    index: number
    timeslot: Timeslot
    locationCount: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const TimeslotRow = ({ index, timeslot, locationCount }: TimeslotRowProps) => {
    const { dispatch } = useContext(AgendaEditorContext)

    const removeTimeslot = (timeslotIndex: number) => {
        dispatch({
            type: "REMOVE_TIMESLOT",
            timeslotIndex
        })
    }

    const setTimeslotDuration = (duration: number, timeslotIndex: number) => {
        dispatch({
            type: "CHANGE_TIMESLOT_DURATION",
            timeslotIndex,
            duration
        })
    }

    return (
        <>
            <th>
                <button className="icons" onClick={() => removeTimeslot(index)}>
                    &times;
                </button>
                <input type="text" value={timeslot.duration} onChange={event => setTimeslotDuration(parseInt(event.target.value, 10), index)} className="timeslot" />
            </th>
            <TimeslotCells index={index} timeslot={timeslot} locationCount={locationCount} />

            <th >
                <button className="icons" onClick={() => removeTimeslot(index)}>
                    &times;
                </button>
                <input type="text" value={timeslot.duration} onChange={event => setTimeslotDuration(parseInt(event.target.value, 10), index)} className="timeslot" />
            </th>
        </>
    )
}


type TimeslotCellsProps = {
    index: number
    timeslot: Timeslot
    locationCount: number
}

const TimeslotCells = ({ timeslot, locationCount, index }: TimeslotCellsProps) => {
    const { dispatch } = useContext(AgendaEditorContext)
    const setBreakTitle = (title: string, timeslotIndex: number) => {
        dispatch({
            type: "CHANGE_BREAK_TITLE",
            timeslotIndex,
            title
        })
    }

    switch (timeslot.timeslotType) {
        case "breakout":
            return (
                <>
                    {(timeslot as BreakoutTimeslot).sessions.map((s, ix) =>
                        <td key={ix} className="session">
                            BreakoutTimeslot
                            {/* <Session session={s} /> */}
                        </td>
                    )}
                </>
            )

        case "break":
            return (
                <td colSpan={locationCount}>
                    <div>
                        <input type="text" value={timeslot.title} onChange={event => setBreakTitle(event.target.value, index)} />
                    </div>
                </td>
            )

        case "keynote":
            return (
                <td colSpan={locationCount} className="session">
                    Keynote
                    {/* <Session session={timeslot.sessions[0]} /> */}
                </td>
            )
    }
}


