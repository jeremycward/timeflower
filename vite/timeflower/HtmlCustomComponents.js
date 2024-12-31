import { TimeSpan } from "./Timespan"
import Handlebars, { create } from "handlebars"
import { EventlineRenderStrategy } from "./itemrenderers/eventline"


import { renderComponentNames, JquerySelector, RenderComponentNames } from "./renderComponentNames"


const createEmptySvg = (scalerect)=>{
    const retVal = document.createElement('svg')
    retVal.setAttribute('width',scalerect.width)
    retVal.setAttribute('height',scalerect.height)
    retVal.append(document.createElement('g'))
    return retVal

}

const createHeaderHolder = (endRowPosition)=>{
    const retVal = document.createElement('div')
    retVal.style.background = 'darkGray'
    retVal.style.gridColumnStart=1
    retVal.style.gridColumnEnd=1
    retVal.style.gridRowStart=endRowPosition
    retVal.style.gridRowEnd=endRowPosition
    return retVal
}
const createAxisHolder = (endRowPosition,id)=>{
    const retVal = document.createElement('div')
    
    retVal.style.gridColumnStart=2
    retVal.style.gridColumnEnd=2
    retVal.style.gridRowStart=endRowPosition
    retVal.style.gridRowEnd=endRowPosition
    retVal.style.background="lightGray"
    retVal.setAttribute('id',id)

    return retVal
}
const createHeaderHolderPanel =(gridTemplateRows)=>{

    const retVal = document.createElement('div')
    retVal.style.background = 'white'
    retVal.style.gridColumnStart=1
    retVal.style.gridColumnEnd=1
    retVal.style.gridRowStart=2
    retVal.style.display='grid'
    retVal.style.gridTemplateColumns='auto'
    retVal.style.gridTemplateRows=gridTemplateRows
    
    return retVal


}

export class TimelineElement extends HTMLElement {
    constructor() {
        super()
        this.xscale = undefined
        this.headerWidth = 100
        this.scaleHeight = '30px'
        this.headerHeight = 100
        this.xscale = undefined
    }

    connectedCallback() {
        this.style.display='grid'
        this.style.gridTemplateColumns = `${this.headerWidth}px auto`
        this.style.gridTemplateRows =  `${this.scaleHeight} auto  ${this.scaleHeight}`
        const gridRowsForTracks = []        
        this.visitTracks((it)=>{gridRowsForTracks.push(`100px`)})        
        this.appendChild(createAxisHolder(1,renderComponentNames.topScaleHolder))
        this.appendChild(createAxisHolder(3, renderComponentNames.bottomScaleHolder))
        this.appendChild(createHeaderHolder(3))        
        this.appendChild(createHeaderHolder(1))                
        this.appendChild(createHeaderHolderPanel(gridRowsForTracks.join(" ")))        
        const scalerect =  document.getElementById(renderComponentNames.bottomScaleHolder).getBoundingClientRect()        
        document.getElementById(renderComponentNames.topScaleHolder).appendChild(createEmptySvg(scalerect))
        document.getElementById(renderComponentNames.bottomScaleHolder).appendChild(createEmptySvg(scalerect))


        this.xscale =
        d3.scaleTime()
        .domain(TimeSpan.valueOf(this).domain())            
        .range([0,scalerect.width])
        .nice()
        
        d3.select(renderComponentNames.idPath(renderComponentNames.topScaleHolder))
        .select('svg')
        .select('g')
        .attr('transform', `translate(0,3)`)
        .call(d3.axisTop(this.xscale))

        d3.select(renderComponentNames.idPath(renderComponentNames.bottomScaleHolder))
        .select('svg')
        .select('g')
        .attr('transform', `translate(0,3)`)
        .call(d3.axisBottom(this.xscale))


    }
    visitTracks(func){
        for (let i = 0; i < this.children.length; i++) {
            func(this.children.item(1))
        }
    }
    getTracks(){ 
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
    getTimeTrackItems() {
        var ret_val = []
        for (let i = 0; i < this.children.length; i++) {
            ret_val.push(this.children.item(i))
        }
        return [...ret_val]
    }




    connectedCallback() {
        this.htmlId = `track_${++FLowerTrackElement.trackCtr}`
        this.yDomain = (this.hasAttribute('maxY') && this.hasAttribute('minY')) ?
            [parseInt(this.getAttribute('maxY')), parseInt(this.getAttribute('minY'))] : [0, 0]
        this.range = TimeSpan.empty()
        this.width = 0
        this.maxYValue = 0
        this.heading = this.getAttribute('heading')
        this.type = this.getAttribute('type')
        this.trackId = this.getAttribute('id')
        this.timeSeriesAxisGutterId = `timeSeriesAxisGutterId_${this.trackId}`

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
    connectedCallback() {
        this.htmlId = `TSE_track_item${this.id}`
    }
}



export class TrackItemElement extends HTMLElement {
    constructor(itemRenderer) {
        super()
        this.itemRenderer = itemRenderer
    }

    connectedCallback() {

        this.htmlId = `track_item_${this.id}`
        console.log(`I'm connected ${this.htmlId}`)
    }

}
export class EventTrackItemElement extends TrackItemElement {
    constructor() {
        super(new EventlineRenderStrategy())
    }
    connectedCallback() {
        super.connectedCallback()
        console.log(`I'm connected also ${this.htmlId}`)
    }


}




export class EventlineItemElement extends SVGPlottableItemElement {
    connectedCallback() {
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
    addEvent(evt) {
        this.events.push(evt)
        this.range.include(evt.date)
    }
}
export class EventlinePlotElement extends HTMLElement {
    connectedCallback() {
        this.parentElement.addEvent(this)
    }
}

