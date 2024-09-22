import './style.css'
import { TimelineRenderer } from './TimeLineRenderer'

window.Split(['.flowerGridMain', '.flowerGridRight'], {
  gutterSize: 10, direction: 'horizontal', sizes: [75, 25]
})
let doit
$(() => {
  const renderer = new TimelineRenderer(document.getElementById('tldata')
    , $('#flowerViewport').width())
  renderer.redraw()
const observer = new ResizeObserver((entries) => {
  clearTimeout(doit)
  doit = setTimeout(()=>{
    console.log('redrwaSync')
    renderer.resize()  
  }, 50)
})
//observer.observe(document.querySelector('.flowerGridMain')) 

d3.select('#flowerViewport').call(d3.zoom()
    .on('zoom', (evt, dat) => {
      renderer.rescale(evt.transform)
      renderer.redraw()
    }))
})












