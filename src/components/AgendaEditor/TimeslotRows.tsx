import React, { Fragment, useContext } from "react"
import { AgendaEditorContext } from "./AgendaEditorContext"
import { BreakoutTimeslot, Timeslot } from "./Agenda"
import { SessionSlot } from "./Session"
import classNames from "classnames"
import { useSortableDragDrop } from "./useSortableDragDrop"


type Row<T> = {
    rowType: "item" | "drop-row"
    data: T
    key: React.Key
}

export const TimeslotRows = () => {
    const { state, dispatch } = useContext(AgendaEditorContext)
    const mimeTypeConverters: { mimeType: string; fn: (data: Timeslot, index: number) => string }[] = [
        { mimeType: "application/agenda+timeslot+json", fn: (timeslot, index) => "" },
        { mimeType: "text", fn: (timeslot, index) => `timeslot: ${timeslot.timeslotType} ${timeslot.duration} mins` }
    ]
    const dnd = useSortableDragDrop<Timeslot>(
        ".duration.draghandle",
        mimeTypeConverters,
        state.timeslots.length,
        (fromTimeslotIndex, toTimeslotIndex, _) => dispatch({ type: "MOVE_TIMESLOT", fromTimeslotIndex, toTimeslotIndex })
    )

    const locationCount = state.locations.length

    let rows: Row<Timeslot>[] = state.timeslots.map((timeslot, index) => ({ rowType: "item", index, data: timeslot, key: index }))

    if (dnd.dragStatus.fromIndex !== undefined && dnd.dragStatus.currentIndex !== undefined) {
        const [{ data }] = rows.splice(dnd.dragStatus.fromIndex, 1)
        rows.splice(dnd.dragStatus.currentIndex, 0, { rowType: "drop-row", data, key: dnd.dragStatus.currentIndex })
    }

    const rowElements = rows.map((row, index) => {
        const timeslot = row.data!
        return (
            <Fragment key={timeslot.id}>
                {
                    row.rowType === "item"
                        ?
                        <tr className={classNames("timeslot", row.data!.timeslotType)}
                            draggable={true}
                            onMouseDown={dnd.mouseDown}
                            onMouseUp={dnd.mouseUp}
                            onDragStart={dnd.dragStart(index, row.data!)}
                            onDragOver={dnd.dragOver(index)}
                            onDragEnd={dnd.dragEnd}
                            ref={elmnt => dnd.setElementRef(elmnt, index)}
                        >
                            <DurationCell duration={timeslot.duration} timeSlotIndex={index} />
                            <TimeslotCells index={index} timeslot={timeslot} locationCount={locationCount} />
                            <DurationCell duration={timeslot.duration} timeSlotIndex={index} />
                        </tr>
                        :
                        // row.rowType === "drop-row"
                        <tr onDragEnd={dnd.dragEnd}
                            onDragOver={e => e.preventDefault()}
                            onDrop={dnd.handleDrop(index)}
                            ref={elmnt => dnd.setElementRef(elmnt, index)}
                        >
                            <td colSpan={locationCount + 2} className="drop-area">
                            </td>
                        </tr>
                }
            </Fragment >
        )
    })

    return (
        <>
            {rowElements}
        </>
    )
}


type DurationCellProps = {
    duration: number
    timeSlotIndex: number
}

const DurationCell = ({ duration, timeSlotIndex }: DurationCellProps) => {
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
        <th className="duration draghandle">
            <button className="icons" onClick={() => removeTimeslot(timeSlotIndex)}>
                &times;
            </button>
            {/* <div className="time from">10:00</div> */}
            <input
                type="text"
                value={duration}
                onChange={event => setTimeslotDuration(parseInt(event.target.value, 10), timeSlotIndex)}
            /> mins
            {/* <div className="time to">10:45</div> */}
        </th>
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


