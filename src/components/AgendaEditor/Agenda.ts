
export type Location = {
    id: number
    name: string
}

export type Session = {
    id: number | null
}


export type BreakTimeslot = {
    id: number
    duration: number
    timeslotType: 'break'
    title: string
}

export type KeynoteTimeslot = {
    id: number
    duration: number
    timeslotType: "keynote"
    sessions: Session[]
}

export type BreakoutTimeslot = {
    id: number
    duration: number
    timeslotType: "breakout"
    sessions: Session[]
}

export type Timeslot = BreakTimeslot | KeynoteTimeslot | BreakoutTimeslot

export type Agenda = {
    start: string
    locations: Location[]
    timeslots: Timeslot[]
}