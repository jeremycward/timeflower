import { element, WebComponent,html } from "@beforesemicolon/web-component"
import {  FlowerTrackItemMarkup } from "../HtmlCustomComponents"
import { RENDER_HINTS, RenderStrategy,calcEventRenderingHints,DefaultTrackRenderStrategy, map2Css } from "../renderSupport"


import { renderComponentNames } from "../renderComponentNames"
import { LayeredPane, layerPositionAttrs } from "../../components/layeredpane"
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

export class EventlineRenderStrategy extends RenderStrategy {
    constructor() {
        super(trackItemTemplate, headingTemplate)
    }
    getMappedData(dataElement,trackRenderingHints) {
        return { events: trackRenderingHints.get(RENDER_HINTS.events) }
    }

    attachTrackItem(itemComp, trackRenderingHints) {
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


export class EventLineFLowerTrackItemElement extends FlowerTrackItemMarkup{
    onMount(){        
        super.onMount()
        this.svgCirclesGroupId = `${this.props.id()}_circles`

        const trackItemHolderId = renderComponentNames.trackItemHolderId(this.props.id())
        const svgLayerId = renderComponentNames.layer(this.props.id(),1)
        this.htmlLayerId  = renderComponentNames.layer(this.props.id(),2)
        const wrapperLayerId = renderComponentNames.layer(this.props.id(),0)

        const htmlLayerCss = {...layerPositionAttrs,position:"relative"}

        const lp = LayeredPane(wrapperLayerId,{},[
            element('div',{attributes : {id: svgLayerId,style:map2Css(
                layerPositionAttrs
            )}}),
            element('div',{attributes : {id: this.htmlLayerId,style:map2Css(htmlLayerCss)}})
        ])
        html `${lp}`.render(document.getElementById(trackItemHolderId))


        const emptySvg = `<svg width="100%" height="100%"><g id="${this.svgCirclesGroupId}"></g></svg>`
        renderComponentNames.select(svgLayerId).append(emptySvg)

    }



}
export class EventElement extends WebComponent{
    static observedAttributes = ['id','date','detail1','detail2']
    
    onMount_(){        
        const itemStart = xAxisScale()(new Date(this.parentElement.props.start()))
        const eventStart = xAxisScale()(new Date(this.props.date()))
        const xPos = eventStart - itemStart                
        
        d3.select(`#${this.parentElement.svgCirclesGroupId}`)
        .selectAll(`#${this.props.id()}`)
        .data([{xPos:xPos}])
        .join("circle")
        .attr("id", this.props.id)
        .attr("r", 5)
        .attr("cx", (d) => {            
            return d.xPos
        })
        .attr("cy", "10%")
        .attr("fill", "black")
        .attr("stroke", "black")

        const htmlLayerElement = element('div',{
            textContent:this.props.detail1(),
            attributes:{

            style: map2Css({
            position: 'absolute',    
            background: 'none',
            fontFamily: 'sans-serif',
            fontSize: '0.8em',
            
            transform: 'rotate(45deg)',
            transformOrigin: `-30% 50%`,
            top: '5%',

            left: `${xPos + 10}px`
        })}})
        html `${htmlLayerElement}` .render(document.getElementById(this.parentElement.htmlLayerId))

    }
    


}


