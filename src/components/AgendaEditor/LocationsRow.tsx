import React, { useContext } from "react"
import { AgendaEditorContext } from "./AgendaEditorContext"
import { Location } from "./Agenda"

export const LocationsRow = () => {
    const { state } = useContext(AgendaEditorContext)

    return (
        <tr>
            <th></th>
            {
                state.locations.map((location, ix) => <InnerLocation key={location.id} index={ix} location={location} />)
            }
            <th></th>
        </tr>
    )
}


type InnerLocationProps = { index: number, location: Location }

// eslint-disable-next-line @typescript-eslint/no-redeclare
const InnerLocation = ({ index, location }: InnerLocationProps) => {
    const { dispatch } = useContext(AgendaEditorContext)


    const removeLocation = (locationIndex: number) => {
        dispatch({
            type: "REMOVE_LOCATION",
            locationIndex
        })
    }

    const setLocationName = (name: string, locationIndex: number) => {
        dispatch({
            type: "CHANGE_LOCATION_NAME",
            locationIndex,
            name
        })
    }

    // const dragStart = (event: React.DragEvent) => {
    //     // TODO: replace element that is moved
    //     event.dataTransfer.setData("application/agenda+location+json", JSON.stringify({ dataType: "timeslot", fromIndex: index }));
    //     event.dataTransfer.setData("text", `timeslot: ${timeslot.timeslotType} ${timeslot.duration} mins`);
    //     event.dataTransfer.effectAllowed = "move";
    // }

    // const dragEnter = (event: React.DragEvent) => {
    //     // // insert temp element before or after
    //     // console.log("***", event.dataTransfer.getData("application/json"));
    //     // let fromIndex = event.dataTransfer.getData("application/json").fromIndex;
    //     // let toIndex = index;
    //     // console.log(`Move from ${fromIndex} to ${toIndex}. Drop area should be ${fromIndex<toIndex ? 'after':'before'}`)
    //     event.preventDefault();
    // }

    // const dragLeave = (event: React.DragEvent) => {
    //     // console.log(event)
    //     event.preventDefault();
    // }

    // const dragOver = (event: React.DragEvent) => {
    //     if(-1 === event.dataTransfer.types.findIndex((type) => "application/agenda+location+json")){
    //         event.dataTransfer.dropEffect = "none";
    //     }else{
    //         event.dataTransfer.dropEffect = "move";
    //     }
    //     event.preventDefault();
    // }

    // const handleDrop = (event: React.DragEvent) => {
    //     let fromLocationIndex = JSON.parse(event.dataTransfer.getData("application/agenda+location+json")).fromIndex;
    //     let toLocationIndex = index;
    //     dispatch({type: "MOVE_LOCATION", fromLocationIndex, toLocationIndex})
    // }

    return (
        <th draggable="false">
            <div className="icons">
                <button onClick={() => removeLocation(index)}>
                    &times;
                </button>
            </div>
            <div className="location">
                <input type="text" value={location.name} onChange={event => setLocationName(event.target.value, index)} />
            </div>
        </th>
    )
}