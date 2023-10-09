import React, { Fragment, useContext, useState } from "react"
import { AgendaEditorContext } from "./AgendaEditorContext"
import { BreakTimeslot, BreakoutTimeslot, KeynoteTimeslot, Timeslot } from "./Agenda"
import { SessionSlot } from "./Session"
import classNames from "classnames"


type DragStatus = {
    fromIndex?: number
    currentIndex?: number
}

const emptyDragOverStatus: DragStatus = { fromIndex: undefined, currentIndex: undefined }

export const TimeslotRows = () => {
    const { state, dispatch } = useContext(AgendaEditorContext)
    const [dragStatus, setDragStatus] = useState<DragStatus>(emptyDragOverStatus)

    const locationCount = state.locations.length


    // --- Drag and Drop ---
    const dragStart = (event: React.DragEvent, index: number, timeslot: Timeslot) => {
        setDragStatus({
            fromIndex: index,
            currentIndex: undefined
        })

        event.dataTransfer.setData("application/agenda+timeslot+json", JSON.stringify({ /*dataType: "timeslot",*/ /*fromIndex: index*/ }))
        event.dataTransfer.setData("text", `timeslot: ${timeslot.timeslotType} ${timeslot.duration} mins`)
        event.dataTransfer.effectAllowed = "move"

        event.dataTransfer.setDragImage(event.currentTarget, 0, event.currentTarget.clientHeight / 2)
    }

    const dragEnd = (event: React.DragEvent) => {
        setDragStatus(emptyDragOverStatus)
    }

    const dragOver = (event: React.DragEvent, index: number) => {
        setDragStatus({
            ...dragStatus,
            currentIndex: index
        })

        if (event.dataTransfer.types.includes("application/agenda+timeslot+json")) {
            event.dataTransfer.dropEffect = "move"
        } else {
            event.dataTransfer.dropEffect = "none"
        }
    }

    const handleDrop = (event: React.DragEvent, index: number) => {
        event.preventDefault()
        if (!event.dataTransfer.types.includes("application/agenda+timeslot+json")) {
            return
        }

        let fromTimeslotIndex = dragStatus.fromIndex!
        let toTimeslotIndex = index
        dispatch({ type: "SWAP_TIMESLOTS", fromTimeslotIndex, toTimeslotIndex })
    }

    //---
    type Row<T> = {
        rowType: "item" | "drop-row"
        data: T
        key: React.Key
    }
    let rows: Row<Timeslot>[] = state.timeslots.map((timeslot, index) => ({ rowType: "item", index, data: timeslot, key: index }))

    if (dragStatus.fromIndex !== undefined && dragStatus.currentIndex !== undefined) {
        const [{ data }] = rows.splice(dragStatus.fromIndex, 1)
        rows.splice(dragStatus.currentIndex, 0, { rowType: "drop-row", data, key: dragStatus.currentIndex })
    }

    const rowElements = rows.map((row, index) =>
        <Fragment key={row.data!.id}>
            {
                row.rowType === "item"
                    ?
                    <tr className={classNames("timeslot", row.data!.timeslotType)} draggable={true}
                        onDragStart={e => dragStart(e, index, row.data!)} onDragOver={e => dragOver(e, index)} onDragEnd={e => dragEnd(e)} onDrop={e => handleDrop(e, index)}
                    >
                        <TimeslotRowCells index={index} timeslot={row.data!} locationCount={locationCount} />
                    </tr>
                    :
                    <tr draggable={true} onDragEnd={e => dragEnd(e)} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, index)}>
                        <DropRow index={index} locationCount={locationCount} />
                    </tr>
            }
        </Fragment>
    )

    return (
        <>
            {rowElements}
        </>
    )
}


type DropRowProps = {
    index: number
    locationCount: number
    // handleDrop: (event: React.DragEvent, index: number) => void
}

const DropRow = ({ index, locationCount }: DropRowProps) => {
    return (
        <td colSpan={locationCount + 2} className="drop-area" onDrop={(e) => console.log("***@@@***")}>
            DROP ROW index: {index}
        </td>
    )
}


type TimeslotRowCellsProps = {
    index: number
    timeslot: Timeslot
    locationCount: number
}

const TimeslotRowCells = ({ index, timeslot, locationCount }: TimeslotRowCellsProps) => {
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
            <th className="duration">
                <button className="icons" onClick={() => removeTimeslot(index)}>
                    &times;
                </button>
                {/* <div className="time from">10:00</div> */}
                <input type="text" value={timeslot.duration} onChange={event => setTimeslotDuration(parseInt(event.target.value, 10), index)} /> mins
                {/* <div className="time to">10:45</div> */}
            </th>

            <TimeslotCells index={index} timeslot={timeslot} locationCount={locationCount} />

            <th className="duration">
                <button className="icons" onClick={() => removeTimeslot(index)}>
                    &times;
                </button>
                {/* <div className="time from">10:00</div> */}
                <input type="text" value={timeslot.duration} onChange={event => setTimeslotDuration(parseInt(event.target.value, 10), index)} /> mins
                {/* <div className="time to">10:45</div> */}
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
                            <SessionSlot session={s} />
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
                    <SessionSlot session={timeslot.sessions[0]} />
                </td>
            )
    }
}


