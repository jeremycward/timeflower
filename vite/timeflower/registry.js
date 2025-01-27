import Handlebars from 'handlebars'
import {    
    TimelineElement,
} from './HtmlCustomComponents'
import {EventLineFLowerTrackElement} from './itemrenderers/eventline'


window.customElements.define('flower-time-line', TimelineElement)
window.customElements.define('event-flower-track',EventLineFLowerTrackElement)


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








    
        


    
