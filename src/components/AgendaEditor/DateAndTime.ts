
export class Timespan {
    private totalSeconds: number

    constructor(param: number | string) {

        if (Number.isSafeInteger(param)) {
            this.totalSeconds = param as number
            return
        } else if (param + '' === param) {
            let parts = param.split(':');
            this.totalSeconds = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60;
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
        return Math.floor(this.totalSeconds / 60 / 60)
    }

    getHours(): number {
        return this.getTotalHours() % 24
    }

    format(formatString: "hh:mm"): string {
        switch (formatString) {
            case 'hh:mm': return `${pad(this.getHours(), 2)}:${pad(this.getMinutes(), 2)}`

            default: throw new Error('Unknown format for Timespan')
        }
    }
}

function pad(n: number, width: number, z = '0') {
    const s = n + ''
    return s.length >= width ? n : new Array(width - s.length + 1).join(z) + n
}
