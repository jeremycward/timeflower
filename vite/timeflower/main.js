import './style.css' with { type: "css" }
import { TimelineRenderer } from './TimeLineRenderer'
var onceOnly = false

const swapElement = document.getElementById('timeline_getter')
console.log(`timelinegetter ${swapElement}`)
swapElement.setAttribute('hx-get' , 'local_timeline_data.html')

document.addEventListener('htmx:afterSwap', function (evt) {
  
  console.log("http req stat.: " + evt.detail.xhr.status )
  console.log(`despatc element ${evt.detail.elt.id}`)
  if (evt.detail.xhr.status === 200) {
    let infoDiv = document.getElementById('timeLineData');
    console.log(evt.detail.xhr)
    console.log(` infodiv ?  -> ${infoDiv}`)
    allLoaded()
  }else{
    alert(`error loading timeline data ${evt.detail.xht.status}`)
  }  
}

);





function allLoaded() {
  const renderer = new TimelineRenderer(document.getElementById('timeLineData')
    , $('#flowerViewport').width())
  renderer.redraw([])

  d3.select('#flowerViewport').call(d3.zoom()
    .on('zoom', (evt, dat) => {      
      renderer.redraw([evt.transform])
    }))


}




