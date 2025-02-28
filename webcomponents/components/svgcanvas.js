import { element } from "@beforesemicolon/markup"
import { renderComponentNames } from "../src/renderComponentNames"
import { map2Css } from "../src/renderSupport"

import {LayeredPane} from "./layeredpane"
const emptySvgBackground = `
<svg width="100%" height="100%">
<g id=${renderComponentNames.tickLines}>
</g>
</svg>
`


export const SvgBackgroundLayer = () => {
    return element('div', {
        attributes: {
            id: renderComponentNames.svgBackgroundLayer,
            style: map2Css( {
                display: 'block',
                width: '100%',
                height: '100%',
                gridColumnStart: 1,
                gridColumnEnd: 1,
                gridRowStart: 1,
                gridRowEnd: 1,
            })

        }
    })
}


export const SvgCanvasForegroundLayer = (gridTemplateRows) => {
    const el = element('div', {
        attributes: {
            id: renderComponentNames.foregroundLayer,
            style: map2Css({
                width: '100%',
                height: '100%',
                display: "grid",
                gridTemplateRows: gridTemplateRows,
                gridTemplateColumns: "100%",                
                gridColumnStart: 1,
                gridColumnEnd: 1,
                gridRowStart: 1,
                gridRowEnd: 1,

            })

        }
    })
    return el
}
export const SvgCanvasWrapper = (gridTemplateRows) => {
    return LayeredPane(
        renderComponentNames.svgBackgroundWrapper, //id
        {
                gridColumnStart: 2,
                gridColumnEnd: 2,
                gridRowStart: 2,
                gridRowEnd:2,

        }, // css
        [
            SvgBackgroundLayer(),
            SvgCanvasForegroundLayer(gridTemplateRows)
        ]
    )
 

}







export const applyTickLines = (xscale)=>{

    renderComponentNames.select(renderComponentNames.svgBackgroundLayer).append(emptySvgBackground)

    const placeHolderElement = $(`#${renderComponentNames.svgBackgroundLayer}`)
    const tickXpositions = []
    xscale.ticks().forEach(
        tick => { tickXpositions.push(xscale(tick)) }
    )
    d3.select(`#${renderComponentNames.svgBackgroundLayer}`)
        .select("svg")
        .select(`#${renderComponentNames.tickLines}`)
        .selectAll("line")
        .data(tickXpositions)
        .join("line")
        .attr("x1", d => d)   
        .attr("x2", d => d)
        .attr("y1", 0)
        .attr("y2", placeHolderElement.height())
        .attr("stroke", "lightgray")

}







