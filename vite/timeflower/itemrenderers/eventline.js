import { RENDER_HINTS, RenderStrategy,calcEventRenderingHints } from "../renderSupport"
import Handlebars from "handlebars"




const eventCircleSvg = (itemComp, trackRenderingHints) => {
    
    d3.select(`#${itemComp.htmlId} div svg #circles`)
        .selectAll("circle")
        .data(trackRenderingHints.get(RENDER_HINTS.events))
        .join("circle")
        .attr("r", 5)
        .attr("cx", (d) => {            
            console.log(d.xPos)
            return d.xPos
        })
        .attr("cy", "10%")
        .attr("fill", "white")
        .attr("stroke", "black")

}



export const headingTemplate = Handlebars.compile(document.getElementById('eventline-track-header').innerHTML)
export const trackItemTemplate = Handlebars.compile(document.getElementById('eventline-item-template').innerHTML)
export class EventlineRenderStrategy extends RenderStrategy {
    constructor() {
        super(trackItemTemplate, headingTemplate)
    }
    getMappedData(dataElement,trackRenderingHints) {
        return { events: trackRenderingHints.get(RENDER_HINTS.events) }
    }

    attachTrackItem(itemComp, trackRenderingHints) {
            // console.log(itemComp)
            // console.log(trackRenderingHints)
            trackRenderingHints.set(RENDER_HINTS.events, calcEventRenderingHints(itemComp, trackRenderingHints.get(RENDER_HINTS.xscale)))
            super.attachTrackItem(itemComp, trackRenderingHints)
            eventCircleSvg(itemComp, trackRenderingHints)
        }
    
    refreshTrackItem(itemContainer, trackRenderingHints) {
        // $(`#${itemContainer.htmlId}`).css({
        //     display: itemContainer.display
        // })

    }
    rowStripeDecorator() {
        return () => { }
    }
    trackRenderingHints() {
        return new Map()
    }

}

