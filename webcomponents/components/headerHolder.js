import { element } from "@beforesemicolon/markup"
import { map2Css } from "../src/renderSupport"
import { renderComponentNames } from "../src/renderComponentNames"

export const HeaderHolder = (rowPosition, id) => {

    return element('div', {
        attributes:
        {
            id: id,
            style: map2Css({
                gridColumnStart:1,
                gridColumnEnd:1,
                gridRowStart:rowPosition,
                gridRowEnd:rowPosition,
                width: '100%',
                height: '100%'
            })
        }
    }
    )
}


export const HeaderHolderPanel =(gridTemplateRows)=>{

    return element('div',{
        attributes:{
            id: renderComponentNames.headingsPaneId,
            
            style: map2Css({
                background :'white',
                gridColumnStart:1,
                gridColumnEnd:1,
                gridRowStart:2,
                gridRowEnd:2,
                display:'grid',
                gridTemplateColumns:'auto',
                gridTemplateRows: gridTemplateRows
            })
            
        }

    })
    


}
