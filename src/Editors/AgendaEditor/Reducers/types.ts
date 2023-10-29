
export type Location = {
    id: number
    name: string
}

export type SessionId = {
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
    sessions: SessionId[]
}

export type BreakoutTimeslot = {
    id: number
    duration: number
    timeslotType: "breakout"
    sessions: SessionId[]
}


export type TimeslotWithSessions = KeynoteTimeslot | BreakoutTimeslot

export type Timeslot = BreakTimeslot | TimeslotWithSessions

export type Agenda = {
    start: string
    locations: Location[]
    timeslots: Timeslot[]
}