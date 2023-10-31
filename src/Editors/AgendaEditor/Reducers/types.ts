
export type Location = {
    id: number
    name: string
}

export type SessionId = {
    id: number | null
}

type TimeslotBase = {
    id: number
    duration: number
    from: string
    to: string
}

export type BreakTimeslot = TimeslotBase & {
    timeslotType: 'break'
    title: string
}

export type KeynoteTimeslot = TimeslotBase & {
    timeslotType: "keynote"
    sessions: SessionId[]
}

export type BreakoutTimeslot = TimeslotBase & {
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