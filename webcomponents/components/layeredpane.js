import { element } from "@beforesemicolon/markup"
import { map2Css } from "../src/renderSupport"
export const LayeredPane = (id,css,layers) => {
    return  element('div', {
        
        attributes: {
            id: id,
            style: map2Css({...css,                
                display: 'grid',
                gridTemplateRows:'1fr',
                gridTemplateColumns:'1fr',
                placeItems:'center',
                placeContent: 'center'
            })
        },
        childNodes: layers
    })
}    
export const  layerPositionAttrs = {
    gridRowStart: 1,
    gridRowEnd:1,
    gridColumnStart:1,
    gridColumnEnd:1,
    width: '100%',
    height: '100%'
}