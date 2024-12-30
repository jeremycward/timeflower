import { TimeSpan } from "./Timespan"
import Handlebars from "handlebars"
import {
    EventlineRenderStrategy
} from "./itemrenderers/eventline"

import { RENDER_HINTS, headerHolderHtmlId, trackHolderHtmlId, itemHolderHtmlId } from "./renderSupport"
import { renderComponentNames, JquerySelector, RenderComponentNames } from "./renderComponentNames"


const placeHolderSuffix = '_placeHolder'
const axisTopId = 'flowerAxisTop'
const axisBaseId = 'flowerAxisBottom'
const svgBackgroundPlaceHolder = "svg_viewport_background_placeholder"

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        console.log(mutationRecord);
    });    
});
const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        console.log('Width:', entry.contentRect.width);
        console.log('Height:', entry.contentRect.height);
    }
});


const defaultHeaderAttachFunction = () => {
    alert("don't call this function !")
}

const makeHolders = (dataElement, xScale) => {
    const itemsToRender = []
    dataElement.getTimeTracks()
        .forEach((thisTrack) => {

            //HEADING HOLDERS
            newOrExistingItem(headerHolderHtmlId(thisTrack),
                //creator
                () => {
                    renderComponentNames.select(renderComponentNames.headingsPaneId)
                        .append(
                            $('<div></div>')
                                .attr('id', headerHolderHtmlId(thisTrack))
                                .css({ borderStyle: 'solid', borderColor: 'red' })
                        )
                },
                // updaterFuncs
                [() => { }]

            )

            //ROW HOLDERS
            newOrExistingItem(trackHolderHtmlId(thisTrack),
                // creator func
                () => {
                    renderComponentNames.select(renderComponentNames.itemsPaneId)

                        .append(
                            $('<div></div>')
                                .attr('id', trackHolderHtmlId(thisTrack))
                                .css({ overflow: 'hidden' })

                        )

                },
                // updater funcs for row holders
                [() => { }]
            )

            thisTrack.getTimeTrackItems().forEach((item) => {
                // ITEM HOLDERS
                const range = TimeSpan.valueOf(item)
                const startPos = xScale(range.start)
                const endPos = xScale(range.end)
                const trackHolder = renderComponentNames.select(trackHolderHtmlId(thisTrack))
                const itemHolderId = itemHolderHtmlId(thisTrack, item)
                newOrExistingItem(itemHolderId,
                    // creator
                    () => {
                        trackHolder.append($('<div></div>')
                            .attr('id', itemHolderId)
                            .css({
                                background: 'yellow',
                                height: '100%',
                                position: 'relative',
                                width: endPos - startPos,
                                left: `${startPos}px`
                            })
                        )
                        const itHolderHtmlId = itemHolderHtmlId(thisTrack,item)                       
                        const newItem = $(`<div>${item.htmlId}</div>`)
                        newItem.appendTo(renderComponentNames.idPath(itHolderHtmlId))
                        renderComponentNames.select(itHolderHtmlId).on('mouseenter',(evt)=>{
                            console.log(evt)
                        })                        
                        resizeObserver.observe(document.getElementById(itemHolderId))


                    },
                    // updater
                    [() => {
                        renderComponentNames.select(itemHolderId).css({
                            width: endPos - startPos,
                            left: `${startPos}px`
                        })
                    }]
                )
                itemsToRender.push(item)
            })

        }


        )
    return itemsToRender


}


const headingSplitMaker = (dataElement, headerWidth, rowHeights) => {

    const viewportContainer = $('#flowerTimeLineViewportContainer')

    viewportContainer.css(
        { display: 'grid', gridTemplateColumns: `${headerWidth}px auto`, gridTemplateRows: 'auto' }
    )
    if (!renderComponentNames.isPresent(renderComponentNames.headingsPaneId)) {
        viewportContainer.append(
            $('<div></div>').attr('id', renderComponentNames.headingsPaneId).css({ display: 'grid' }),
            $('<div></div>').attr('id', renderComponentNames.itemsPaneId).css({ display: 'grid' })

        )
    }
    let rowHeightsStr = ""
    rowHeights.forEach((rh) => {
        rowHeightsStr += (` ${rh}px `)
    })

    renderComponentNames.select(renderComponentNames.headingsPaneId)
        .css({
            gridTemplateColumns: 'auto',
            gridTemplateRows: rowHeightsStr
        })

}

const trackItemStrategy = (itemComp) => itemTemplateStrategies[itemComp.trackType]


const trackHeaderStrategy = (trackData) => itemTemplateStrategies[trackData.type]

const axisGridLinesMaker = (svgBackgroundPlaceHolder, xscale) => {
    const placeHolderElement = $(`#${svgBackgroundPlaceHolder}`)

    const tickXpositions = []
    xscale.ticks().forEach(tick => { tickXpositions.push(xscale(tick)) })
    d3.select(`#${svgBackgroundPlaceHolder}`)
        .select("svg")
        .select("#tickLines")
        .selectAll("line")
        .data(tickXpositions)
        .join("line")
        .attr("x1", d => d)
        .attr("x2", d => d)
        .attr("y1", 0)
        .attr("y2", placeHolderElement.height())
        .attr("stroke", "black")
}


const axisContainerMaker = (elementId, xScale, transformAmount, axisFunction, headerWidth) => {

    if (document.getElementById(elementId) === null) {
        const tablePlaceHolderElementId = `${elementId}${placeHolderSuffix}`

        const tableWrapperElement = $("<div>")

        tableWrapperElement.attr('id', `${elementId}_tableWrapper`)

        tableWrapperElement.css({
            display: 'grid',
            gridTemplateColumns: `${headerWidth}px auto`,
            gridTemplateRows: '30px'
        })





        const headerFillerElement = $("<div>")
        headerFillerElement.css({
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 1,
            gridColumnEnd: 1
        })

        const axisElement = $("<div>")
        axisElement.attr('id', elementId)
        axisElement.css({
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 2,
            gridColumnEnd: 2,

        })
        axisElement.append(emptySvg)

        $(`#${tablePlaceHolderElementId}`).append(tableWrapperElement)
        tableWrapperElement.append(headerFillerElement)
        tableWrapperElement.append(axisElement)


    }

    d3.select(`#${elementId}`)
        .select('svg')
        .select('g')
        .attr('transform', `translate(0,${transformAmount})`)
        .call(axisFunction(xScale))
}


const calc_offset_width = (xScale, range) => {
    var startOffset = xScale(range.start)

    return { startOffset: startOffset }
}
const plot_points_from_ts_item_element = (itemElement) => {
    const childCount = itemElement.childElementCount
    var retVal = []
    for (var i = 0; i < childCount; i++) {
        const ppElement = itemElement.children.item(i)
        retVal.push({
            date: new Date(ppElement.getAttribute('date')),
            value: parseFloat(ppElement.getAttribute('value'))
        })
    }
    return retVal
}

const headingTemplates = {
    'TSE': Handlebars.compile(document.getElementById('time-series-track-header').innerHTML),
    'sequence': Handlebars.compile(document.getElementById('sequence-track-header').innerHTML),

}
const trackItemTemplates = {
    'TSE': Handlebars.compile(document.getElementById('time-series-item-template').innerHTML),
    'sequence': Handlebars.compile(document.getElementById('track-item-template').innerHTML),

}


const dataMappers = {
    'TSE': {
        dataMapper: (dataElement, trackRenderingHints) => {
            const plotPoints = plot_points_from_ts_item_element(dataElement)
            const xScale = trackRenderingHints.get(RENDER_HINTS.xscale)
            const posn = calc_offset_width(xScale, TimeSpan.valueOf(dataElement))
            const y = trackRenderingHints.get(RENDER_HINTS.yscale)


            const windowRangeStart = xScale.domain()[0]
            const itemRangeStart = new Date(dataElement.getAttribute('start'))
            const hasOverHang = itemRangeStart < windowRangeStart
            const overHangAmt = hasOverHang ? Math.round(xScale(itemRangeStart)) : 0

            var commandLine = ''
            for (const [index, pp] of plotPoints.entries()) {
                const commandCode = index > 0 ? 'L' : 'M'
                commandLine = ` ${commandLine} ${commandCode} ${xScale(pp.date) - posn.startOffset} ${y(pp.value)} `
            }

            return {
                'path': commandLine, 'tickRules': trackRenderingHints.get(RENDER_HINTS.tickRules),
                'width': posn.width, id: `${dataElement.htmlId}Content`,
                'leftOverHang': overHangAmt
            }
        }

    },
    'sequence': {
        dataMapper:
            (dataElement, trackRenderingHints) => {
                const d1 = new Date(dataElement.getAttribute('start'))
                const d2 = new Date(dataElement.getAttribute('end'))
                const det1val = dataElement.getAttribute('detail1')
                const det2val = dataElement.getAttribute('detail2')

                return {
                    range: new TimeSpan(d1, d2),
                    name: dataElement.getAttribute('name'),
                    img: dataElement.getAttribute('img'),
                    detailRows: [
                        det1val.length > 0 ? det1val : undefined,
                        det2val.length > 0 ? det2val : undefined
                    ].filter(it => it !== undefined)

                }

            }
    }

}
const defaultItemAttachFunction = (itemComp, trackRenderingHints) => {
    const mappedData = evtLineStrategey.dataMapper(itemComp.dataElement, trackRenderingHints)
    const trackItemHtml = trackItemTemplates[itemComp.trackType](mappedData)
    $(`#${itemComp.htmlId}`).append(trackItemHtml)
}


const itemTemplateStrategies = {
    'TSE': {
        attachTrackItem: defaultItemAttachFunction,
        refreshTrackItem: (itemContainer, trackRenderingHints) => {
            const mappedData = dataMappers[itemContainer.trackType].dataMapper(itemContainer.dataElement, trackRenderingHints)
            const trackItemHtml = trackItemTemplates[itemContainer.trackType](mappedData)
            $(`#${itemContainer.htmlId}Content`).replaceWith(trackItemHtml)
        },
        attachHeader: (track, trackRenderingHints) => {
            const trackHeight = trackRenderingHints.get(RENDER_HINTS.trackHeight)
            defaultHeaderAttachFunction(track, trackHeight)
            trackRenderingHints.set(RENDER_HINTS.yscale, d3.scaleLinear().domain(track.yDomain).range([0, trackHeight]))
            trackRenderingHints.set(RENDER_HINTS.ticks, 5)
            d3.select('#' + track.timeSeriesAxisGutterId)
                .select('svg')
                .select('g')
                .attr('transform', 'translate(25,0)')
                .attr('transform', 'translate(25,0)')
                .call(
                    d3.axisLeft(trackRenderingHints.get(RENDER_HINTS.yscale))
                        .ticks(trackRenderingHints.get(RENDER_HINTS.ticks))
                )
        },
        rowStripeDecorator: (trackData, trackRenderingHints) => {
            // const yscale = trackRenderingHints.get(RENDER_HINTS.yscale)
            // const ticks = yscale.ticks(trackRenderingHints.get(RENDER_HINTS.ticks))
            // const tickRules = ticks.map(it => yscale(it))
            // trackRenderingHints.set(RENDER_HINTS.tickRules, tickRules)
            // $(`#${rowStripeElementId(trackData)}`).append(TSETrackTemplate({
            //     tickRules: tickRules,
            //     width: trackRenderingHints.get(RENDER_HINTS.headerWidth)
            // }))
        },

        trackRenderingHints: (track) => new Map()
    },
    'sequence': {
        attachTrackItem: defaultItemAttachFunction,
        refreshTrackItem: (itemContainer, trackRenderingHints) => {
            $(`#${itemContainer.htmlId}`).css({
                display: itemContainer.display
            })
        },
        attachHeader: defaultHeaderAttachFunction,
        rowStripeDecorator: () => { },
        trackRenderingHints: (track) => new Map()
    }
}


function newOrExistingItem(elementId, creatorFunc, updateFuncs) {
    var foundElement = $(`#${elementId}`)
    var foundElement = foundElement.length > 0 ? foundElement : creatorFunc()
    updateFuncs.forEach(func => { func(foundElement) })
    return foundElement
}



const emptySvg = '<svg width="100%" height="100%"><g></g></svg>'

export class TimelineRenderer {

    // before removing ref to element range
    constructor(dataElement, width) {
        this.evtLineStrategey = new EventlineRenderStrategy()
        this.headerWidth = 100
        this.dataElement = dataElement
        this.xscale = d3.scaleTime()
        this.originalX = this.xscale
            .domain(TimeSpan.valueOf(dataElement).domain())
            .range([0, width])
            .nice()

    }

    redraw(transformations) {
        transformations.forEach((it) => {

            this.xscale = it.rescaleX(this.originalX)
        })
        const tracksCollection = this.dataElement.getTimeTracks()
        const rowHeights = []
        Array.from(tracksCollection).forEach(() => rowHeights.push(100))

        const rowCount = tracksCollection.length
        axisContainerMaker(axisTopId, this.xscale, 29, d3.axisTop, this.headerWidth)
        axisContainerMaker(axisBaseId, this.xscale, 3, d3.axisBottom, this.headerWidth)
        axisGridLinesMaker(svgBackgroundPlaceHolder, this.xscale)
        headingSplitMaker(this.dataElement, this.headerWidth, rowHeights)
        const itemsToFill = makeHolders(this.dataElement, this.xscale)
        itemsToFill.forEach(
            (item)=>{                
            }
        )




    }


}

