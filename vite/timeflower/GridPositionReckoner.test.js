import { GridPositionReckoner } from "./GridPositionReckoner";
import {makeScale,scales,makeTimeSpan}  from "./TimeSpan.test"

const item01 = 
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


test('removes off-limit items from CSS phrase',()=>{
    const x =  makeScale('1940-01-01', '1950-01-01', 1000)
    var underTest = new GridPositionReckoner(x,[{timeTrackItems:[item01]}])
    const result = underTest.calcGridColumnCss(underTest.colTags) 
    expect (underTest.itemComponentsAccumulator.components[0].display).toBe('none')
    expect (result.length).toBe(0)

})


test ('displays two rows',()=>{

    const x = scales.LAST_CENTURY
    var underTest = new GridPositionReckoner(x,[{timeTrackItems:[item01,item02]},{timeTrackItems:[item03,item04]}])
    const result = underTest.calcGridColumnCss(underTest.colTags)    
    expect (result).toBe('200px [item03Start] 50px [item03End item03PaddingStart] 50px [item03PaddingEnd item04Start] 100px [item04End] 100px [item01Start] 100px [item01End item01PaddingStart] 100px [item01PaddingEnd item02Start] 100px [item02End] ')   

})




test ('displays Single item in correct position',()=>{

    const x = scales.LAST_CENTURY
    var underTest = new GridPositionReckoner(x,[{timeTrackItems:[item01]}])
    const result = underTest.calcGridColumnCss(underTest.colTags)    
    expect (result).toBe('500px [item01Start] 100px [item01End] ')   
})

test ('displays two items separated by padding',()=>{

    const x = scales.LAST_CENTURY
    var underTest = new GridPositionReckoner(x,[{timeTrackItems:[item01,item02]}])
    const result = underTest.calcGridColumnCss(underTest.colTags)    
    expect (result).toBe('500px [item01Start] 100px [item01End item01PaddingStart] 100px [item01PaddingEnd item02Start] 100px [item02End] ')   

})

