import { GridPositionReckoner } from "./GridPositionReckoner";
import {makeScale,scales,makeTimeSpan}  from "./TimeSpan.test"

const item01_1950_1960 = 
{
    htmlId: 'item01',
    range: makeTimeSpan('1950-01-01','1960-01-01')

}
const item02 = 
{
    htmlId: 'item02',
    range: makeTimeSpan('1970-01-01','1980-01-01')            


}
const item03 = 
{
    htmlId: 'item03',
    range: makeTimeSpan('1920-01-01','1925-01-01')            

}
const item04 = 
{
    htmlId: 'item04',
    range: makeTimeSpan('1930-01-01','1940-01-01')            
   

}
test ('displays Single item in correct position',()=>{

    const x = scales.LAST_CENTURY
    var underTest = new GridPositionReckoner(x,[{timeTrackItems:[item01_1950_1960]}])
    const result = underTest.calcGridColumnCss(underTest.colTags)    
    expect (result).toBe('500px [item01Start] 100px [item01End] ')   
})



