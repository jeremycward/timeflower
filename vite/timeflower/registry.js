import Handlebars from 'handlebars'
import {
    TrackItemElement,
    TimeSeriesItemElement,
    TimeSeriesPlotElement,
    FLowerTrackElement,
    TimelineElement,
    EventlineItemElement,
    EventlinePlotElement
} from './HtmlCustomComponents'

window.customElements.define('flower-time-line', TimelineElement)
window.customElements.define('flower-track', FLowerTrackElement)
window.customElements.define('track-item', TrackItemElement)
window.customElements.define('time-series-plot', TimeSeriesPlotElement)
window.customElements.define('time-series-item', TimeSeriesItemElement)
window.customElements.define('timetrack-item-view', HTMLElement)
window.customElements.define('event-item', EventlineItemElement)
window.customElements.define('event-plot', EventlinePlotElement)

Handlebars.registerHelper("yoffset", function (idx) {
    
    console.log('hello from yoffset ' + idx)
    return ((idx % 4) * 20) + 15
})



    
        
            

    
