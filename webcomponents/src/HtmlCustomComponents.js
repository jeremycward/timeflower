import { TimeSpan } from "./Timespan"
import { map2Css } from './renderSupport'
import { WebComponent, html, element } from '@beforesemicolon/web-component'
import { renderComponentNames } from "./renderComponentNames"
import {  SvgCanvasWrapper,applyTickLines } from "../components/svgcanvas"
import { AxisHolder} from "../components/axisHolder"
import { HeaderHolder, HeaderHolderPanel } from "../components/headerHolder"





const emptySvg = '<svg width="100%" height="100%"><g></g></svg>'

const emptySvgBackground = `
<svg width="100%" height="100%">
<g id=${renderComponentNames.tickLines}>
</g>
</svg>
`

const createForegroundHolder = (gridTemplateRows) => {
    const retVal = document.createElement('div')
    retVal.setAttribute("id", renderComponentNames.foregroundLayer)
    retVal.style.width = "100%"
    retVal.style.height = "100%"
    retVal.style.display = "grid"
    retVal.style.gridTemplateRows = gridTemplateRows
    retVal.style.gridTemplateColumns = " auto "
    retVal.style.background = "#00ff000F"
    retVal.style.gridColumnStart = 2
    retVal.style.gridColumnEnd = 2
    retVal.style.gridRowStart = 2
    retVal.style.gridRowEnd = 2

    return retVal

}
const createHeaderHolder = (endRowPosition) => {
    const retVal = document.createElement('div')

    retVal.style.gridColumnStart = 1
    retVal.style.gridColumnEnd = 1
    retVal.style.gridRowStart = endRowPosition
    retVal.style.gridRowEnd = endRowPosition
    return retVal
}
const createAxisHolder = (endRowPosition, id) => {
    const retVal = document.createElement('div')
    retVal.style.gridColumnStart = 2
    retVal.style.gridColumnEnd = 2
    retVal.style.gridRowStart = endRowPosition
    retVal.style.gridRowEnd = endRowPosition
    retVal.style.display = 'flex'
    retVal.style.alignItems = 'center'
    retVal.style.width = '100%'
    retVal.style.height = '100%'
    retVal.setAttribute('id', id)
    return retVal
}
const createHeaderHolderPanel = (gridTemplateRows) => {

    const retVal = document.createElement('div')
    retVal.style.background = 'white'
    retVal.style.gridColumnStart = 1
    retVal.style.gridColumnEnd = 1
    retVal.style.gridRowStart = 2
    retVal.style.display = 'grid'
    retVal.style.gridTemplateColumns = 'auto'
    retVal.style.gridTemplateRows = gridTemplateRows
    retVal.id = renderComponentNames.headingsPaneId

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
        .attr("y2",placeHolderElement.height())
        .attr("stroke", "blue")
}

const createSvgBackgroundLayer = () => {
    const retVal = document.createElement('div')
    retVal.setAttribute('id', renderComponentNames.svgBackgroundLayer)
    retVal.style.gridColumnStart = 2
    retVal.style.gridColumnEnd = 2
    retVal.style.gridRowStart = 2
    retVal.style.display = 'block'
    retVal.style.width = '100%'
    retVal.style.height = '100%'
    return retVal
}
const createBackgroundWrapperElement = () => {

    const retVal = document.createElement('div')
    retVal.setAttribute('id', renderComponentNames.svgBackgroundWrapper + "_leg")
    retVal.style.gridColumnStart = 2
    retVal.style.gridColumnEnd = 2
    retVal.style.gridRowStart = 2
    retVal.style.display = 'block'
    return retVal
}


export class TimelineElementMarkup extends WebComponent {
    initialState = {
        headerWidth: 100,
        timescale: d3.scaleTime()
        .domain([new Date(),new Date()])
        .range([0,100])
        .nice(),
    }
    static observedAttributes = ['start', 'end', 'id']
    static initialTrackHeight=100    
    config = {
        shadow: true
    }
    start='.'
    end='.'
    id='.'
    
    constructor() {
        super()                
        this.trackCount = 0                
        this.scaleHeight = '30px'
        this.headerHeight = 100
        this.initialTimescale=null
        this.transformedTimescale=null
        
        

    }
    calcTrackRows(){
        return `repeat(${this.children.length},${TimelineElementMarkup.initialTrackHeight}px)`

    }
    onUpdate(name, newValue, oldValue){
        console.log(`jcw update ${name} ${newValue} -> ${oldValue}`)

    }

    onMount() {        
        super.onMount()
        this.trackCount=0
        const mainTableLayout = element('div', {
            attributes: {
                id: renderComponentNames.mainGridLayout,  
                style: map2Css({
                    display: 'grid',
                    gridTemplateColumns:  `${this.state.headerWidth()}px auto`,
                    gridTemplateRows: `${this.scaleHeight} auto  ${this.scaleHeight}`
                })
            },
            childNodes: [
                AxisHolder(1, renderComponentNames.topScaleHolder),
                SvgCanvasWrapper(this.calcTrackRows()),
                HeaderHolder(1, renderComponentNames.headerSpacerTop),
                HeaderHolderPanel(this.calcTrackRows()),
                HeaderHolder(3, renderComponentNames.headerSpacerBottom),
                AxisHolder(3, renderComponentNames.bottomScaleHolder),
            ],            
        }

        )
        html`${mainTableLayout}`.render(document.body)

        const scalerect = document.getElementById(renderComponentNames.bottomScaleHolder).getBoundingClientRect()

        this.initialTimescale = d3.scaleTime()
                                 .domain([new Date(this.props.start()),new Date(this.props.end())])
                                 .range([0, scalerect.width])
                                 .nice()

        this.transformedTimescale = this.initialTimescale                                 

        
        applyTickLines(this.transformedTimescale)                
        

        d3.select(`#${renderComponentNames.mainGridLayout}`).call(d3.zoom()
                .on('zoom', (evt) => {             

                    this.transformedTimescale = evt.tranform.rescaleX(this.initialTimescale)
                    const timescaleEvt = new CustomEvent("timescale", {
                        detail: {
                            scale: this.transformedTimescale
                        },
                        capture: false,
                        bubbles: true,
                        composed: false
                      });
                      document.getElementById(renderComponentNames.topScaleHolder).dispatchEvent(timescaleEvt)                      
                
                }))
        

    }
    incrementTrackCount(){
        this.trackCount +=1 
    }

}


export class FLowerTrackElementMarkup extends WebComponent {    
    static observedAttributes = ['heading', 'id']
    
    onMount_() {
        this.parentElement.incrementTrackCount()
        super.onMount()
        this.headingComponent().render(document.getElementById(renderComponentNames.headingsPaneId))
        this.trackHolderComponent().render(document.getElementById(renderComponentNames.foregroundLayer))

    }
    headingComponent() {          
        const el= element('div', {
            textContent: `${this.props.heading()} `,
        })
        return html `${el}`        
    }
    trackHolderComponent(){       
        const borderTop = parent.trackCount > 1 ? 'none': '1px solid lightgray'
        const el= element('div', {            
            attributes: {
                id: renderComponentNames.trackHolderId(this.props.id()),
                style: map2Css({
                    position:'relative',
                    overflow:'hidden',
                    background: 'none',
                    borderBottom: '1px solid lightgray',
                    borderTop: borderTop
                    

                })
}
        })
        return html `${el}`        


    }

}




export class FlowerTrackItemMarkup extends WebComponent{
    static observedAttributes = ['id','start','end']
    constructor(){
        super()
        this.timeSpan = TimeSpan.valueOf(this)
        this.timelineState = this.parentElement.parentElement.state
    }
    onMount_() {        
        super.onMount()        
        const offsetStart = this.timelineState.xScale()(new Date(this.props.start()))
        const offsetEnd = this.timelineState.xScale()(new Date(this.props.end()))

        const itemComp = element('div',{
            attributes: {
                id: renderComponentNames.trackItemHolderId(this.props.id()),
                style: map2Css({
                    position: 'relative',
                    top: '0px',
                    left: `${offsetStart}px`,
                    width: `${offsetEnd-offsetStart}px`,
                    height: `100%`,                      
                })
            }
            
        })
        const trackHolderId = renderComponentNames.trackHolderId(this.parentElement.props.id())        
        const trackHolderElement =  document.getElementById(trackHolderId)
        html `${itemComp}`.render(trackHolderElement)        

    }
}











