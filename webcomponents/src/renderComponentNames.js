

export class RenderComponentNames{
    constructor(){        
        this.headingsPaneId = "headingsPane"
        this.mainGridLayout = "mainGridLayout"
        this.itemsPaneId = "itemsPane"
        this.topScaleHolder = "scale_holder_top"
        this.bottomScaleHolder = "scale_holder_bottom"
        this.svgBackgroundLayer="svg-background-layer"
        this.svgBackgroundWrapper="svgBackgroundWrapper"
        this.headerSpacerTop="headerSpacerTop"
        this.headerSpacerBottom="headerSpacerBottom"
        this.tickLines="tickLines"
        this.foregroundLayer = "svg-foreground-layer"
        this.eventLineLayeredPanePrefix = "eventline_layered_"
        this.FLOWER_TIME_LINE_ELEMENT="flower-time-line"
        this.AXIS_CONTAINER="axis-container"
        this.EVENT_FLOWER_TRACK ="event-flower-track"
        this.TRACK_HOLDER_PREFIX = "track_holder_"
        this.TRACK_ITEM_HOLDER_PREFIX = "track_item_holder_"
        this.TRACK_ITEM_HOLDER_WRAPPER = "track_item_holder_wrapper_"
        this.EVENT_TRACK_ITEM ="event-track-item"
        this.EVENT_ITEM="event-item"
        
    }
    select(name){
        
        return $(this.idPath(name))
    }
    isPresent(name){
        return this.select(name).length > 0
    }
    idPath(name){
        return `#${name}`;

    }
    trackHolderId(trackId){
        return `${this.TRACK_HOLDER_PREFIX}${trackId}`

    }
    trackItemHolderId(trackItemId){
        return `${this.TRACK_ITEM_HOLDER_PREFIX}${trackItemId}`

    }
    trackItemHolderWrapperId(trackItemId){
        return `${this.TRACK_ITEM_HOLDER_PREFIX}${trackItemId}`

    }
    layer(id,layer){
        return `${id}_layer_${layer}`
    }




}
export const renderComponentNames = new RenderComponentNames();

export const JquerySelector = (name)=>{
 }

