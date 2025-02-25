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


    isVisibleInsideScale(xScale,headerWith) {
        throw new Error("this method is deprecated")
        
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
