
export class TimeOfDay {
    private totalSeconds: number

    constructor(param: number | string) {
        if (Number.isSafeInteger(param)) {
            this.totalSeconds = param as number
            return
        } else if (param + '' === param) {
            // expected format is ISO8601 in the form "2023-10-32T10:00:00+00:00" or "2023-10-32T10:00:00Z"
            const [date, timeOfDay, timezone] = param.split(/[T+Z]/)
            const [hours, minutes, seconds] = timeOfDay.split(':')
            this.totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10)
            return
        }

        throw new Error("Invalid parameter in Timespan constructor")
    }

    getTotalSeconds(): number {
        return this.totalSeconds
    }

    getSeconds(): number {
        return this.totalSeconds % 60
    }

    getTotalMinutes(): number {
        return Math.floor(this.totalSeconds / 60)
    }

    getMinutes(): number {
        return this.getTotalMinutes() % 60
    }

    getTotalHours(): number {
        return Math.floor(this.getTotalMinutes() / 60)
    }

    getHours(): number {
        return this.getTotalHours() % 24
    }

    addSeconds(seconds: number) {
        this.totalSeconds += seconds
        return this
    }

    addMinutes(minutes: number) {
        this.addSeconds(minutes * 60)
        return this
    }

    addHours(hours: number) {
        this.addMinutes(hours * 60)
        return this
    }

    format(formatString: "hh:mm" | "hh:mm:ss"): string {
        switch (formatString) {
            case 'hh:mm':
                return `${pad(this.getHours(), 2)}:${pad(this.getMinutes(), 2)}`

            case 'hh:mm:ss':
                return `${pad(this.getHours(), 2)}:${pad(this.getMinutes(), 2)}:${pad(this.getSeconds(), 2)}`

            default:
                throw new Error('Unknown format for Timespan')
        }
    }
}

function pad(n: number, width: number, z = '0') {
    const s = n + ''
    return s.length >= width ? n : new Array(width - s.length + 1).join(z) + n
}
