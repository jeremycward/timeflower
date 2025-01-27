import { TimeSpan } from "./Timespan"
import Handlebars, { create } from "handlebars"



import { renderComponentNames, JquerySelector, RenderComponentNames } from "./renderComponentNames"

const emptySvg = '<svg width="100%" height="100%"><g></g></svg>'
const emptySvgBackground = `
<svg width="100%" height="100%">
<g id=${renderComponentNames.tickLines}>
</g>
</svg>
`

const createForegroundHolder=(gridTemplateRows)=>{
    const retVal = document.createElement('div')
    retVal.setAttribute("id",renderComponentNames.foregroundLayer)
    retVal.style.width="100%"
    retVal.style.height="100%"
    retVal.style.display="grid"
    retVal.style.gridTemplateRows = gridTemplateRows
    retVal.style.gridTemplateColumns = " auto "
    retVal.style.background="#00ff000F"
    retVal.style.gridColumnStart=2
    retVal.style.gridColumnEnd=2
    retVal.style.gridRowStart=2
    retVal.style.gridRowEnd=2

    return retVal

}
const createHeaderHolder = (endRowPosition)=>{
    const retVal = document.createElement('div')
    
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
    retVal.style.display='flex'
    retVal.style.alignItems='center'
    retVal.style.width='100%'
    retVal.style.height='100%'
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
    retVal.id=renderComponentNames.headingsPaneId
    
    return retVal

}

const axisGridLinesMaker = (svgBackgroundPlaceHolder, xscale) => {
    const placeHolderElement = $(`#${svgBackgroundPlaceHolder}`)
    const tickXpositions = []
    xscale.ticks().forEach(tick => { tickXpositions.push(xscale(tick)) })
    d3.select(`#${svgBackgroundPlaceHolder}`)
        .select("svg")
        .select("#tickLines")
        .selectAll("line")
        .data(tickXpositions)
        .join("line")
        .attr("x1", d => d)
        .attr("x2", d => d)
        .attr("y1", 0)
        .attr("y2", placeHolderElement.height())
        .attr("stroke", "black")
}

const createSvgBackgroundLayer=()=>{
    const retVal = document.createElement('div')    
    retVal.setAttribute('id', renderComponentNames.svgBackgroundLayer)
    retVal.style.gridColumnStart=2
    retVal.style.gridColumnEnd=2
    retVal.style.gridRowStart=2
    retVal.style.display='block'
    retVal.style.width = '100%'
    retVal.style.height = '100%'
    return retVal
}
const createBackgroundWrapperElement= ()=>{
    const retVal = document.createElement('div')    
    retVal.style.gridColumnStart=2
    retVal.style.gridColumnEnd=2
    retVal.style.gridRowStart=2
    retVal.style.display='block'    
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
        console.log(`connected: ${this.nodeName}`)
        this.style.display='grid'
        this.style.gridTemplateColumns = `${this.headerWidth}px auto`
        this.style.gridTemplateRows =  `${this.scaleHeight} auto  ${this.scaleHeight}`
        const gridRowsForTracks = []        
        this.visitTracks((it)=>{gridRowsForTracks.push(`100px`)})        
        const gridRowTemplate = gridRowsForTracks.join(" ")
        this.appendChild(createAxisHolder(1,renderComponentNames.topScaleHolder))
        this.appendChild(createAxisHolder(3, renderComponentNames.bottomScaleHolder))
        this.appendChild(createHeaderHolder(3))        
        this.appendChild(createHeaderHolder(1))                
        this.appendChild(createHeaderHolderPanel(gridRowTemplate))        
        const scalerect =  document.getElementById(renderComponentNames.bottomScaleHolder).getBoundingClientRect()        
        renderComponentNames.select(renderComponentNames.bottomScaleHolder).append(emptySvg)
        renderComponentNames.select(renderComponentNames.topScaleHolder).append(emptySvg)

        this.xscale =
        d3.scaleTime()
        .domain(TimeSpan.valueOf(this).domain())            
        .range([0,scalerect.width])
        .nice()

        d3.select(renderComponentNames.idPath(renderComponentNames.bottomScaleHolder))
        .select('svg')
        .select('g')
        .attr('transform', `translate(0,6)`)
        .call(d3.axisBottom(this.xscale))

        d3.select(renderComponentNames.idPath(renderComponentNames.topScaleHolder))
        .select('svg')
        .select('g')
        .attr('transform', `translate(0,23)`)
        .call(d3.axisTop(this.xscale))

        // create background wrapper
        const bgWrapper = createBackgroundWrapperElement() 
        this.appendChild(bgWrapper)
        bgWrapper.appendChild(createSvgBackgroundLayer())

        renderComponentNames.select(renderComponentNames.svgBackgroundLayer).append(emptySvgBackground)

        axisGridLinesMaker(renderComponentNames.svgBackgroundLayer,this.xscale)
        // create foreground holder
        this.appendChild(createForegroundHolder(gridRowTemplate))

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

    constructor(trackRenderStrategy){        
        super()    
        this.trackRenderStrategy = trackRenderStrategy
    }

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
            console.log(`connected: ${this.nodeName}`)
            const trackHolder = document.createElement("div")
            trackHolder.setAttribute("id",this.getAttribute("id"))
            trackHolder.style.margin='15px'
            trackHolder.style.background="#FF00000F"
            document.getElementById(renderComponentNames.foregroundLayer).appendChild(trackHolder)
            const headerComponent = this.trackRenderStrategy.attachHeaderFunc(this)
            const headerHolder = document.getElementById(renderComponentNames.headingsPaneId)
            headerHolder.appendChild(headerComponent)
            
    }

}












