/**
 * @jest-environment jsdom
 */


import { renderComponentNames, RenderComponentNames } from './renderComponentNames'
import {TimelineElement} from './HtmlCustomComponents'



test ('it registers Components ok',()=>{
    expect (window.customElements.get(renderComponentNames.FLOWER_TIME_LINE_ELEMENT)).toBeDefined()
    expect (window.customElements.get("sjsldfsjdlfsdlfksdlfkjsdlfjsdlkf")).toBeUndefined()
})
,
test("it renders markup timeline component ok",async ()=>{
    expect (document.getElementById(renderComponentNames.headingsPaneId)).toBeNull()    
    expect (document.getElementById(renderComponentNames.bottomScaleHolder)).toBeNull()    
    expect (document.getElementById(renderComponentNames.topScaleHolder)).toBeNull()    
    document.body.innerHTML =`
    <${renderComponentNames.FLOWER_TIME_LINE_ELEMENT} start="1950-01-01" end ="1960-01-01">    

   <event-flower-track type="eventline" heading="Current Affairs1" id="A" >
   <event-track-item start="1950-07-07" end="1955-04-01" id="A1">        
        <event-item id="A1_1" name="VCong invade saigon" detail1="A1_1" detail2="A1_1_detail" date="1960-01-01"></event-item>        
         <event-item id="A1_2" name="event two name" detail1="A1_2" detail2="A2_1_detail" date="1960-05-01"></event-item>        
   </event-track-item>
   </event-flower-track>


   <${renderComponentNames.FLOWER_TIME_LINE_ELEMENT}/>    
`
    const mainGridLayoutElement = document.getElementById(renderComponentNames.mainGridLayout)        
    expect (mainGridLayoutElement.style.display).toBe('grid')
    expect (mainGridLayoutElement.style.gridTemplateRows).toBe('30px auto  30px')
    expect (mainGridLayoutElement.style.gridTemplateColumns).toBe('100px auto')
    

})


