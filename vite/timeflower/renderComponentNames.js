

export class RenderComponentNames{
    constructor(){        
        this.headingsPaneId = "headingsPane"
        this.itemsPaneId = "itemsPane"
        this.topScaleHolder = "scale_holder_top"
        this.bottomScaleHolder = "scale_holder_bottom"
        this.svgBackgroundLayer="svg-background-layer"
        this.tickLines="tickLines"
        this.foregroundLayer = "svg-foreground-layer"
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

}
export const renderComponentNames = new RenderComponentNames();

export const JquerySelector = (name)=>{
 }

