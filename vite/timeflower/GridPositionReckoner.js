import { TimeSpan  } from "./Timespan"

class CssGridClauseBuilder{

    constructor(){

    }
    addClause(itemOffset,labels){

    }

}

class ItemComponentsAccumulator {
    constructor() {
        this.components = []
    }
    last(){
        if (this.components.length ===0){
            return undefined
        }else{
            return this.components[this.components.length-1]
        }
    }
    byRowId(htmlId){
        const retVal = this.components.filter(it=>{
            const equiv = it.rowHtmlId==htmlId
            return equiv
        })                
        return retVal
    }
    
}
class ColulmnTagsAccumulator {
    constructor() {
        this.colTags = new Map()
    }
    sorted(){
        return new Map([...this.colTags.entries()].sort((lhs, rhs) => { 
            return lhs[0] - rhs[0] 
        }))
    } 

    pushColumnName(xOffset, name) {
        if (!this.colTags.has(xOffset)) {
            this.colTags.set(xOffset, [])
        }
        this.colTags.get(xOffset).push(name)
    }


}

const defaultRangeFinderFunction  = (trackItem,xScale)=>{
    return TimeSpan.valueOf(trackItem)

}
const rangeFinderFunctions={
    'eventline' : (trackItem,xScale)=>{
        const startDate = trackItem.date
        const beginOffset = xScale(startDate)
        const endOffset = beginOffset+ 100
        const endDate = xScale.invert(endOffset)
        return new TimeSpan(startDate,endDate)
    },
    'TSE': defaultRangeFinderFunction,
    'sequence': defaultRangeFinderFunction
}


const rowPositionReckonerFunc = (trackNumber, colTagsAccumulator, itemComponentsAccumulator,track,xScale,headerWidth) => {

    const processTrackItem = (trackItem,headerWidth) => {
        var paddingRequired = 0
        
        const range = rangeFinderFunctions[track.type](trackItem,xScale)
        const col_start = Math.round(xScale(range.start))
        const col_end_ceiling = Math.round(xScale.range()[1]-100)  
        const col_end_actual = Math.round(xScale(range.end))      
        const col_end = Math.min(col_end_ceiling,col_end_actual)      
        const col_start_label = `${trackItem.htmlId}Start`
        const col_end_label = `${trackItem.htmlId}End`

        const isVisible  = range.isVisibleInsideScale(xScale,headerWidth)
        
        var lastComponent = itemComponentsAccumulator.last()
        if (lastComponent && isVisible){
            paddingRequired = col_start - lastComponent.absoluteEndPosition            
        }
        if (paddingRequired>0 ){
            colTagsAccumulator.pushColumnName(lastComponent.absoluteEndPosition,`${lastComponent.htmlId}PaddingStart`)            
            colTagsAccumulator.pushColumnName(Math.min(col_start,col_end_ceiling),`${lastComponent.htmlId}PaddingEnd`)            
        }
        
        if (isVisible){
            colTagsAccumulator.pushColumnName(col_start, col_start_label)
            colTagsAccumulator.pushColumnName(col_end, col_end_label)
        }
        

        const gridPosnCssInfo = { 
            trackType: track.getAttribute('type'),  
            dataElement: trackItem,                     
            absoluteEndPosition : col_end,
            gridColumnStart: col_start_label,
            gridColumnEnd: col_end_label,
            gridRow: `${trackNumber}`,
            rowHtmlId : track.htmlId,
            htmlId: trackItem.htmlId,            
            display: isVisible ? 'grid' : 'none'
        }
        itemComponentsAccumulator.components.push(gridPosnCssInfo)
    }
    
    const childCtr = track.childElementCount
    for (let i=0;i<childCtr;i++){
        processTrackItem(track.children.item(i),headerWidth)
    }
}
export class GridPositionReckoner {
    constructor(xScale, tracks,headerWidth) {
        this.xScale = xScale
        this.colTagsAccumulator = new ColulmnTagsAccumulator()
        this.itemComponentsAccumulator = new ItemComponentsAccumulator()
        let trackNumber = 1
        tracks.forEach((tr) => {            
                rowPositionReckonerFunc(trackNumber,
                    this.colTagsAccumulator,
                    this.itemComponentsAccumulator,
                    tr,
                    xScale,headerWidth) 
                    trackNumber++            
                }            
        )
    }

    calcGridColumnCss(vpWidth) {
        const viewportWidth = Math.round(vpWidth)
        const sortedMap = this.colTagsAccumulator.sorted()
        
        var clauseBody = ""
        var currentOffset = 0
        for (const [key, value] of sortedMap.entries()) {
            const namesClause = `[${value.join(' ')}]`
            var adjustedPosn = Math.max(0, (key - currentOffset))            
            const posnClause = `${adjustedPosn}px`
            currentOffset += adjustedPosn
            currentOffset = Math.min(viewportWidth,currentOffset)
            clauseBody = `${clauseBody}${posnClause} ${namesClause} `
        }        
        const finalColumn = Math.max(0,viewportWidth - currentOffset)

        const retVal = `0px [head_start] 100px [head_end axis_start] ${clauseBody} ${finalColumn}px [axis_end]`          
        //console.log(retVal)
        return retVal
    }

}
