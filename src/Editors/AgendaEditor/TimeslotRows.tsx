import React, { Fragment, useContext } from "react"
import { AgendaEditorContext } from "./AgendaEditorContext"
import { BreakoutTimeslot, Timeslot } from "./Reducers/types"
import { SessionSlot } from "./Session"
import classNames from "classnames"
import { useSortableDragDrop } from "../../components/DragDropHelpers/useSortableDragDrop"
import { insertAtIndex, removeAtIndex } from "../../components/array-helpers"
import { MimeTypeConverterArray } from "../../components/DragDropHelpers/types"

type Row<T> = {
    rowType: "item-row"|"drop-row"
    data: T
    key: React.Key
}

export const TimeslotRows = () => {
    const { state, dispatch } = useContext(AgendaEditorContext)
    const mimeTypeConverters: MimeTypeConverterArray<Timeslot, number> = [
        { mimeType: "application/agenda-timeslot+index+json", fn: (_, index) => ({ index }) },
        { mimeType: "text", fn: (timeslot, _) => `timeslot: ${timeslot.timeslotType} ${timeslot.duration} mins` }
    ]
    const dnd = useSortableDragDrop<Timeslot, number>(
        ".duration.draghandle",
        mimeTypeConverters,
        state.timeslots.length,
        (fromTimeslotIndex, toTimeslotIndex) => dispatch({ type: "MOVE_TIMESLOT", fromTimeslotIndex, toTimeslotIndex })
    )

    const locationCount = state.locations.length

    let rows: Row<Timeslot>[] = state.timeslots.map((timeslot, index) => ({ rowType: "item-row", index, data: timeslot, key: index }))

    if (dnd.dragStatus.fromIndex !== undefined && dnd.dragStatus.currentIndex !== undefined) {
        const { data } = rows[dnd.dragStatus.fromIndex]
        rows = removeAtIndex(rows, dnd.dragStatus.fromIndex)
        rows = insertAtIndex(rows, dnd.dragStatus.currentIndex, {rowType: "drop-row", data, key: dnd.dragStatus.currentIndex })
    }

    const rowElements = rows.map((row, index) => {
        const timeslot = row.data!
        return (
            <Fragment key={timeslot.id}>
                {
                    row.rowType === "item-row"
                        ?
                        <tr className={classNames("timeslot", timeslot.timeslotType)}
                            draggable={true}
                            onMouseDown={dnd.mouseDown}
                            onMouseUp={dnd.mouseUp}
                            onDragStart={dnd.dragStart(index, timeslot)}
                            onDragOver={dnd.dragOver(index)}
                            onDragEnd={dnd.dragEnd}
                            ref={elmnt => dnd.setElementRef(elmnt, index)}
                        >
                            <DurationCell duration={timeslot.duration} timeSlotIndex={index} />
                            <TimeslotCells timeslotIndex={index} timeslot={timeslot} locationCount={locationCount} />
                            <DurationCell duration={timeslot.duration} timeSlotIndex={index} />
                        </tr>
                        :
                        // row.rowType === "drop-row"
                        <tr onDragEnd={dnd.dragEnd}
                            onDragOver={e => e.preventDefault()}
                            onDrop={dnd.handleDrop(index)}
                            ref={elmnt => dnd.setElementRef(elmnt, index)}
                            className="drop-area"
                        >
                            <td colSpan={locationCount + 2} >
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
            <div className="time from">10:00</div>
            <input
                type="text"
                value={duration}
                onChange={event => setTimeslotDuration(parseInt(event.target.value, 10), timeSlotIndex)}
            /> mins
            <div className="time to">10:45</div>
        </th>
    )
}


type TimeslotCellsProps = {
    timeslotIndex: number
    timeslot: Timeslot
    locationCount: number
}

const TimeslotCells = ({ timeslot, locationCount, timeslotIndex }: TimeslotCellsProps) => {
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
                    {(timeslot as BreakoutTimeslot).sessions.map((s, locationIndex) =>
                        <td key={locationIndex} className="session">
                            <SessionSlot session={s} timeslotIndex={timeslotIndex} locationIndex={locationIndex} />
                        </td>
                    )}
                </>
            )

        case "break":
            return (
                <td colSpan={locationCount}>
                    <div>
                        <input type="text" value={timeslot.title} onChange={event => setBreakTitle(event.target.value, timeslotIndex)} />
                    </div>
                </td>
            )

        case "keynote":
            return (
                <td colSpan={locationCount} className="session">
                    <SessionSlot session={timeslot.sessions[0]} timeslotIndex={timeslotIndex} locationIndex={0}  />
                </td>
            )
    }
}


