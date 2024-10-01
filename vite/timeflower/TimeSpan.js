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

    startEndOffsets(xScale,headerWidth){
        const xrange = xScale.range()        
        const myStart = xScale(this.start)
        const myEnd = xScale(this.end)
        const startOffset =  myStart - xrange[0];
        const endOffset = (myEnd + headerWidth) - xrange[1];        
        var startOffset_indicator = startOffset + (myEnd - myStart)
        startOffset_indicator /= Math.abs(startOffset_indicator)
        var endOffset_indicator = (endOffset -(myEnd -myStart))*-1
        endOffset_indicator /= Math.abs(endOffset_indicator)
        const overLapIndicator = startOffset_indicator + endOffset_indicator >0
        return {overlap: overLapIndicator, startOffset: startOffset_indicator, endOffset: endOffset_indicator}




    }

    isVisibleInsideScale(xScale,headerWith) {
        const result = this.startEndOffsets(xScale,headerWith)       
        return result.overlap
        
        
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
