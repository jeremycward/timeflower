import './style.css'
import { TimelineRenderer } from './TimeLineRenderer'



$(() => {
  const renderer = new TimelineRenderer(document.getElementById('tldata')
    , $('#flowerViewport').width())
  renderer.redraw()

d3.select('#flowerViewport').call(d3.zoom()
    .on('zoom', (evt, dat) => {
      renderer.rescale(evt.transform)
      renderer.redraw()
    }))
})












