

export class RenderComponentNames{
    constructor(){        
        this.headingsPaneId = "headingsPane"
        this.itemsPaneId = "itemsPane"
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

