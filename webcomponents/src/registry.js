import Handlebars from 'handlebars'

import { renderComponentNames } from './renderComponentNames'
import {  FLowerTrackElementMarkup } from './HtmlCustomComponents'
import { TimelineElementMarkup } from './HtmlCustomComponents'
import {EventLineFLowerTrackItemElement} from './itemrenderers/eventline'
import { EventElement } from './itemrenderers/eventline'
import { AxisContainer } from '../components/axisHolder'
window.customElements.define(renderComponentNames.AXIS_CONTAINER,AxisContainer)
window.customElements.define(renderComponentNames.FLOWER_TIME_LINE_ELEMENT, TimelineElementMarkup)
window.customElements.define(renderComponentNames.EVENT_FLOWER_TRACK,FLowerTrackElementMarkup)
window.customElements.define(renderComponentNames.EVENT_TRACK_ITEM,EventLineFLowerTrackItemElement)
window.customElements.define(renderComponentNames.EVENT_ITEM,EventElement)





Handlebars.registerHelper("yoffset", function (idx) {    
    
    return ((idx % 4) * 20) + 15
})

Handlebars.registerHelper("chopLeft", function (px) {    
    
    return      `translate(${px},0)`

})

Handlebars.registerHelper("eventName", function () {    
    return this.name        
})

Handlebars.registerHelper("eventxPos",function(){
    return `${this.xPos}px`
})
Handlebars.registerHelper("getTrackHeading",function(){
    return this.getAttribute("heading")
})








    
        


    
