export class TimeSpan {
    static valueOf(dataElement){        
        return new TimeSpan(new Date(dataElement.getAttribute('start')), 
        new Date(dataElement.getAttribute('end')))
    }
    static empty() {
        return new TimeSpan(new Date(8.64e15), new Date(-8.64e15))
    }
    constructor(date1, date2) {
        this.start = date1
        this.end = date2
    }

    isVisibleInsideScale(xScale) {
        const scaleStart = xScale.domain()[0].getTime()
        const scaleEnd = xScale.domain()[1].getTime()

        const myStart = this.start.getTime()
        const myEnd = this.end.getTime()

        if (myStart< scaleStart && myEnd > scaleEnd){
            return true
        }

        const startVisible = myStart > scaleStart && myStart < scaleEnd
        const endVisible = myEnd >= scaleStart && myEnd <= scaleEnd

        return startVisible || endVisible
    }

    merge(newRange) {
        if (newRange.start < this.start) {
            this.start = newRange.start
        }
        if (newRange.end > this.end) {
            this.end = newRange.end
        }

    }
    include(point) {
        if (point < this.start) {
            this.start = point
        }
        if (point > this.end) {
            this.end = point
        }

    }
    domain() {
        return [this.start, this.end]
    }

}
