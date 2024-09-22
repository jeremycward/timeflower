import { TimeSpan } from "./Timespan"
import { GridPositionReckoner } from "./GridPositionReckoner"
import Handlebars from "handlebars"

export class TimelineElement extends HTMLElement {


    connectedCallback() {        
        this.range = new TimeSpan(new Date('1950-01-01'), new Date('2050-01-01'))
        this.pendingTransforms = new Array()

    }
    includeRange(newRange) {
        this.range.merge(newRange)

    }

    getTimeTracks() {
        var ret_val = []
        for (let i = 0; i < this.children.length; i++) {
            ret_val.push(this.children.item(i))
        }
        return [...ret_val]
    }

}

export class FLowerTrackElement extends HTMLElement {
    static trackCtr = 0
    static trackRegistry = new Map()

    static rhPadding = {
        'TSE': 0,
        'sequence': 0,
        'eventline': 100,
    }



    connectedCallback() {        
        this.htmlId = `track_${++FLowerTrackElement.trackCtr}`        
        this.yDomain = (this.hasAttribute('maxY') && this.hasAttribute('minY'))   ?
              [parseInt(this.getAttribute('maxY')),parseInt(this.getAttribute('minY'))] : [0,0]
        this.range = TimeSpan.empty()
        this.timeTrackItems = []
        this.width = 0
        this.maxYValue = 0
        this.heading = this.getAttribute('heading')
        this.type = this.getAttribute('type')
        this.trackId = this.getAttribute('id')
        this.timeSeriesAxisGutterId = `timeSeriesAxisGutterId_${this.trackId}`

        this.gutterFuncs = {
            'TSE': () => {
                let seln = d3.select(`#${this.timeSeriesAxisGutterId}`)
                    .select('svg')
                    .select('g')
                    .call(d3.axisLeft(this.y))
            },
            'sequence': () => {
            },
            'eventline': () => {
            }

        }
        FLowerTrackElement.trackRegistry.set(this.trackId, this)
    }
    renderHeader() {
        let newEl = document.createElement('div');
        const template = FLowerTrackElement.headingTemplates[this.type]
        this.trackHeight = 100
        newEl.innerHTML = template(this)
        $('#flowerTimeLineHeadingContainer').append(newEl)
        this.gutterFuncs[this.type]()
    }


}

export class TimeSeriesPlotElement extends HTMLElement {
    connectedCallback() {        
    }
}
export class SVGPlottableItemElement extends HTMLElement {
    addPlotPoint(pp) {
        this.plotPoints.push(pp)
    }

    connectedCallback() {
        this.range = TimeSpan.empty()
        this.plotPoints = []
        this.parentNode.timeTrackItems.push(this)
        this.name = this.getAttribute('name')
    }

}
export class TimeSeriesItemElement extends SVGPlottableItemElement {
    static trackItemTemplate = Handlebars.compile(
        document.getElementById('time-series-item-template').innerHTML
    );
    addPlotPoint(pp) {
        super.addPlotPoint(pp)        
    }
    connectedCallback(){
        this.htmlId = `TSE_track_item${this.id}`
    }
}



export class TrackItemElement extends HTMLElement {
    connectedCallback() {
        this.htmlId = `track_item_${this.id}`
    }


}

export class EventlineItemElement extends SVGPlottableItemElement {   
    connectedCallback(){
        this.htmlId = `event_item_${this.getAttribute('id')}` 
        this.name = this.getAttribute('name')
        this.date = new Date(this.getAttribute('date'))
        const det1val = this.getAttribute('detail1')
        const det2val = this.getAttribute('detail2')
        this.detailRows = [
            det1val.length > 0 ? det1val : undefined,
            det2val.length > 0 ? det2val : undefined
        ].filter(it => it !== undefined)
        
    }
    addEvent(evt){
        this.events.push(evt)
        this.range.include(evt.date)
    }
}
export class EventlinePlotElement extends HTMLElement {
    connectedCallback() {
        this.parentElement.addEvent(this)
    }
}

