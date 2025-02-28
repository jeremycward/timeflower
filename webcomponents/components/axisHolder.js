import { renderComponentNames } from "../src/renderComponentNames"
import { map2Css } from "../src/renderSupport"
import { WebComponent, html, element } from '@beforesemicolon/web-component'

export const AxisHolder = (endRowPosition, id) => {

    const el = element('div', {
        htmlContent: [
            html `<axis-container id=${id}></axis-container>`
        ],
        attributes:
        {            
            endRowPosition: endRowPosition,
            style: map2Css({
                gridColumnStart: 2,
                gridColumnEnd: 2,
                gridRowStart: endRowPosition,
                gridRowEnd: endRowPosition,
            })
        },
    }
    )
    return el
}

export class AxisContainer extends WebComponent {    

    config = {
        shadow: false
    }
    onMount(){        

        document.getElementById(renderComponentNames.mainGridLayout).addEventListener('timescale',(evt)=>{
            this.attachAxes(evt.detail.scale)  
        })
    }


    render() {
        const el = element('svg', {
            attributes:
            {
                ns: "https://www.w3.org/TR/SVG2",
                width: '100%',
                height: '100%',                
            }
        }
        )
        return el

    }
    attachAxes (xscale) {
        const bottomScaleHolder = d3.select(renderComponentNames.idPath(renderComponentNames.bottomScaleHolder))

        d3.select(renderComponentNames.idPath(renderComponentNames.bottomScaleHolder))
            .select('svg')
            .select('g')
            .attr('transform', `translate(0,6)`)
            .call(d3.axisBottom(xscale))

        d3.select(renderComponentNames.idPath(renderComponentNames.topScaleHolder))
            .select('svg')
            .select('g')
            .attr('transform', `translate(0,23)`)
            .call(d3.axisTop(xscale))
    }
    rescale(xscale){

    }

}

