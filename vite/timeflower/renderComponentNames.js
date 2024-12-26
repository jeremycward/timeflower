

export class RenderComponentNames{
    constructor(){        
        this.headingsPaneId = "headingsPane"
        this.itemsPaneId = "itemsPane"
    }
    select(name){
        const selectorStr = `#${name}`;
        return $(selectorStr)
    }
    isPresent(name){
        return this.select(name).length > 0
    }

}
export const renderComponentNames = new RenderComponentNames();

export const JquerySelector = (name)=>{
 }

