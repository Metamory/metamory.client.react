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