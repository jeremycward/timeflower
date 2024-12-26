
import { TimeSpan } from "./Timespan"

export const defaultRangeFinderFunction  = (trackItem,xScale)=>{
    return TimeSpan.valueOf(trackItem)
}

export const componentRegistry = new Map()


export const rangeFinderFunctions={
    'eventline' : (trackItem,xScale)=>{
        const startDate = new Date(trackItem.attributes.start.value)
        const endDate = new Date(trackItem.attributes.end.value)
        const beginOffset = xScale(startDate)
        const endOffset = beginOffset+ 100
        
        return new TimeSpan(startDate,endDate)
    },
    'TSE': defaultRangeFinderFunction,
    'sequence': defaultRangeFinderFunction
}



export const RENDER_HINTS = {
    xscale: 0,
    trackHeight: 1,
    yscale: 2,
    ticks: 3,
    viewportWidth: 4,
    itemIndex: 5,
    tickRules: 6,
    topOfEventLine: 7,
    events: 8
}

const calcEventxPos =(itemComponent,eventData,xScale)=>{
    const eventDate = new Date(eventData.getAttribute('date'))
    const eventPosnAbsolute = xScale(eventDate)
    const distanceFromStart = eventPosnAbsolute - Math.max(0, itemComponent.colStart)
    return distanceFromStart 

}


export const  calcEventRenderingHints = (itemComponent,xScale)=>{
    const retVal = []    
    for (let item of itemComponent.dataElement.children) {
        const xPos = calcEventxPos(itemComponent,item,xScale)        

        const itemHints = {
            name: item.getAttribute("name"),
            xPos: xPos
        }
        retVal.push(itemHints)
        
    }
    return retVal
}


export const headerHolderHtmlId = track => `${track.htmlId}_headerHolder`

export const trackHolderHtmlId = track => `${track.htmlId}_trackHolder`
export const itemHolderHtmlId = (track,item) => `${track.htmlId}_${item.id}_itemHolder`


export class RenderStrategy{
    constructor(itemTemplate,headingTemplate){
        this.itemTemplate = itemTemplate
        this.headingTemplate = headingTemplate        
    }
    getMappedData(dataElement,trackRenderingHints){
        return new Map()
    }
    attachTrackItem(itemComp, trackRenderingHints){
            const mappedData = this.getMappedData(itemComp.dataElement, trackRenderingHints)
            const trackItemHtml = this.itemTemplate(mappedData)
            $(`#${itemComp.htmlId}`).append(trackItemHtml)
    }
    refreshTrackItem(){
        
    }
    attachHeader(track, trackRenderingHints){
        $(`#${headerHolderHtmlId(track)}`).append(this.headingTemplate(track))
    }
    rowStripeDecorator(){
        
    }
    trackRenderingHints(){
        return new Map()
    }

}








  


