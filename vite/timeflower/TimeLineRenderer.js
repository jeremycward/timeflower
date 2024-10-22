import { TimeSpan } from "./Timespan"
import { GridPositionReckoner } from "./GridPositionReckoner"
import Handlebars from "handlebars"

const RENDER_HINTS = {
    xscale: 0,
    trackHeight: 1,
    yscale: 2,
    ticks: 3,
    viewportWidth: 4,
    itemIndex: 5,
    tickRules: 6
}
const placeHolderSuffix = '_placeHolder'
const axisTopId = 'flowerAxisTop'
const axisBaseId = 'flowerAxisBottom'

const trackItemStrategy = (itemComp) => itemTemplateStrategies[itemComp.trackType]
const headerHtmlId = track => `${track.htmlId}_header`
const rowStripeElementId = track => `${track.htmlId}_rowStripeElement`
const trackHeaderStrategy = (trackData) => itemTemplateStrategies[trackData.type]

const axisContainerMaker_old = (elementId, rowStart, rowEnd, xScale) => {
    const axisElement = $("<div>")
    axisElement.attr('id', elementId)
    axisElement.addClass("flowerAxis")
    axisElement.css({
        gridRowStart: rowStart,
        gridRowEnd: rowEnd,
        gridColumnStart: 'axis_start',
        gridColumnEnd: 'axis_end',

    })

    $('#flowerGridWrapper').append(axisElement)

    axisElement.append(emptySvg)
    const isTopAxis = rowStart == 1 && rowEnd == 1
    const transFormAmount = isTopAxis ? 29 : 0
    d3.select(`#${elementId}`)

        .select('svg')
        .select('g')
        .attr('transform', `translate(0,${transFormAmount})`)
        .call(isTopAxis ? d3.axisTop(xScale) : d3.axisBottom(xScale))

}



const axisContainerMaker = (elementId, xScale, transformAmount, axisFunction, gridTemplateCss) => {

    console.log(`css: ${gridTemplateCss}`)

    const tablePlaceHolderElementId = `${elementId}${placeHolderSuffix}`

    const tableWrapperElement = $("<div>")

    tableWrapperElement.attr('id', `${elementId}_tableWrapper`)

    tableWrapperElement.css({
        display: 'grid',
        gridTemplateColumns: gridTemplateCss,
        gridTemplateRows: 'auto'
    })

    const headerFillerElement = $("<div>")
    headerFillerElement.css({
        gridRowStart: 1,
        gridRowEnd: 1,
        gridColumnStart: 'head_start',
        gridColumnEnd: 'head_end',
    })

    const axisElement = $("<div>")
    axisElement.attr('id', elementId)
    axisElement.css({
        gridRowStart: 1,
        gridRowEnd: 1,
        gridColumnStart: 'axis_start',
        gridColumnEnd: 'axis_end',

    })
    axisElement.append(emptySvg)

    $(`#${tablePlaceHolderElementId}`).append(tableWrapperElement)
    tableWrapperElement.append(headerFillerElement)
    tableWrapperElement.append(axisElement)

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
const TSETrackTemplate = Handlebars.compile(document.getElementById('time-series-row-stripe-template').innerHTML)
const headingTemplates = {
    'TSE': Handlebars.compile(document.getElementById('time-series-track-header').innerHTML),
    'sequence': Handlebars.compile(document.getElementById('sequence-track-header').innerHTML),
    'eventline': Handlebars.compile(document.getElementById('eventline-track-header').innerHTML),
}
const trackItemTemplates = {
    'TSE': Handlebars.compile(document.getElementById('time-series-item-template').innerHTML),
    'sequence': Handlebars.compile(document.getElementById('track-item-template').innerHTML),
    'eventline': Handlebars.compile(document.getElementById('eventline-item-template').innerHTML)
}

const dataMappers = {
    'eventline': {
        dataMapper:
            (dataElement, trackRenderingHints) => {
                const xPos = trackRenderingHints.get(RENDER_HINTS.xscale)(dataElement.date)
                return {
                    x: xPos,
                    idx: trackRenderingHints.get(RENDER_HINTS.itemIndex),
                    name: dataElement.name
                }
            }

    },
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
    const mappedData = dataMappers[itemComp.trackType].dataMapper(itemComp.dataElement, trackRenderingHints)
    const trackItemHtml = trackItemTemplates[itemComp.trackType](mappedData)
    $(`#${itemComp.htmlId}`).append(trackItemHtml)
}
const defaultHeaderAttachFunction = (track) => {
    $(`#${headerHtmlId(track)}`).append(headingTemplates[track.type](track))
}

const itemTemplateStrategies = {
    'eventline': {
        attachTrackItem: defaultItemAttachFunction,
        refreshTrackItem: (itemContainer, trackRenderingHints) => {
            $(`#${itemContainer.htmlId}`).css({
                display: itemContainer.display
            })
        },
        attachHeader: defaultHeaderAttachFunction,
        rowStripeDecorator: () => { },
        trackRenderingHints: (track) => new Map()


    },
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
            const yscale = trackRenderingHints.get(RENDER_HINTS.yscale)
            const ticks = yscale.ticks(trackRenderingHints.get(RENDER_HINTS.ticks))
            const tickRules = ticks.map(it => yscale(it))
            trackRenderingHints.set(RENDER_HINTS.tickRules, tickRules)
            $(`#${rowStripeElementId(trackData)}`).append(TSETrackTemplate({
                tickRules: tickRules,
                width: trackRenderingHints.get(RENDER_HINTS.viewportWidth)
            }))
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




const emptySvg = '<svg width="100%" height="100%"><g></g></svg>'

export class TimelineRenderer {

    static newOrExistingItem(elementId, creatorFunc, updateFuncs) {
        var foundElement = $(`#${elementId}`)
        var foundElement = foundElement.length > 0 ? foundElement : creatorFunc()
        updateFuncs.forEach(func => { func(foundElement) })
        return foundElement
    }



    // before removing ref to element range
    constructor(dataElement, width) {
        this.headerWidth = 100
        this.trackHeight = 100
        this.viewportWidth = width
        this.dataElement = dataElement
        this.xscale = d3.scaleTime()
        this.originalX = this.xscale
            .domain(dataElement.range.domain())
            .range([0, width])
            .nice()

    }
    resize() {
        this.viewportWidth = $('#flowerViewport').width()
        this.redraw()
    }

    redraw() {
        const tracksCollection = this.dataElement.getTimeTracks()
        const rowCount = tracksCollection.length

        const reckoner = new GridPositionReckoner(this.xscale, tracksCollection, this.headerWidth)



        const itemMapper = (itemComp) => {
            return $(`<div></div>`).css(
                {
                    gridColumnStart: itemComp.gridColumnStart,
                    gridColumnEnd: itemComp.gridColumnEnd,
                    gridRowStart: itemComp.gridRow,
                    gridRowEnd: itemComp.gridRow,
                    display: itemComp.display
                }
            ).attr('id', itemComp.htmlId)
        }

        // todo fix me .. need to parameterize header width
        const gridTemplateCss = reckoner.calcGridColumnCss(this.viewportWidth - 100)
        const gridTemplateRowsCss = `repeat(${rowCount},100px )`

        TimelineRenderer.newOrExistingItem('flowerGridWrapper',
        /*creatorFunc*/() => {
                $('#flowerTimeLineViewportContainer').append(
                    $('<div></div>')
                        .attr('id', 'flowerGridWrapper')
                        .css(
                            {
                                display: 'grid',
                                'grid-template-columns': gridTemplateCss,
                                gap: '0px',
                                gridTemplateRows: gridTemplateRowsCss,
                                columnRule: "4px dotted rgb(79 185 227)"
                            }
                        )
                )

                //row headers
                var rowCtr = 0
                this.dataElement.getTimeTracks().forEach(
                    (trackData) => {
                        const trackRenderingHints = trackHeaderStrategy(trackData).trackRenderingHints(trackData)
                        rowCtr++
                        trackRenderingHints.set(RENDER_HINTS.viewportWidth, this.viewportWidth)
                        const headerContainerElement = $("<div>")
                        headerContainerElement.css(
                            {
                                gridRowStart: `${rowCtr}`,
                                gridRowEnd: `${rowCtr}`,
                                gridColumnStart: 'head_start',
                                gridColumnEnd: 'head_end',
                            }
                        )
                        headerContainerElement.addClass('flowerTrackHeadingContainer')
                        headerContainerElement.attr("id", headerHtmlId(trackData))
                        $('#flowerGridWrapper').append(headerContainerElement)
                        trackRenderingHints.set(RENDER_HINTS.trackHeight, this.trackHeight)
                        trackRenderingHints.set(RENDER_HINTS.xscale, this.xscale)
                        trackHeaderStrategy(trackData).attachHeader(trackData, trackRenderingHints)


                        // row stripes
                        const rowStripeElement = $("<div></div")
                        rowStripeElement.css(
                            {
                                gridRowStart: `${rowCtr}`,
                                gridRowEnd: `${rowCtr}`,
                                gridColumnStart: 'axis_start',
                                gridColumnEnd: 'axis_end',
                            }
                        )
                        rowStripeElement.attr("id", rowStripeElementId(trackData))
                        rowStripeElement.addClass("rowStripe")

                        $('#flowerGridWrapper').append(rowStripeElement)
                        trackHeaderStrategy(trackData).rowStripeDecorator(trackData, trackRenderingHints)
                        // add each item

                        var itemIndex = 1
                        reckoner.itemComponentsAccumulator.byRowId(trackData.htmlId).forEach(itemContainer => {
                            trackRenderingHints.set(RENDER_HINTS.itemIndex, itemIndex++)
                            $('#flowerGridWrapper')
                                .append(itemMapper(itemContainer))
                            trackItemStrategy(itemContainer).attachTrackItem(itemContainer, trackRenderingHints)
                        })
                    }
                )

            },
        /*[updaterFunc])*/[() => {
                $('#flowerGridWrapper').css({
                    gridTemplateColumns: gridTemplateCss
                })
                this.dataElement.getTimeTracks().forEach(
                    (trackData) => {
                        // todo: this can be harmonized with the main create function loop ?
                        const trackRenderingHints = trackHeaderStrategy(trackData).trackRenderingHints(trackData)
                        trackRenderingHints.set(RENDER_HINTS.yscale, d3.scaleLinear()
                            .domain(trackData.yDomain)
                            .range([0, this.trackHeight]))
                        const itemsOnThisTrack = reckoner.itemComponentsAccumulator.byRowId(trackData.htmlId)
                        trackRenderingHints.set(RENDER_HINTS.trackHeight, this.trackHeight)
                        trackRenderingHints.set(RENDER_HINTS.xscale, this.xscale)
                        itemsOnThisTrack.forEach(itemContainer => {
                            trackItemStrategy(itemContainer).refreshTrackItem(itemContainer, trackRenderingHints)
                        })

                    }
                )
                //axes
                axisContainerMaker(axisTopId, this.xscale, 29, d3.axisTop, gridTemplateCss)                
                axisContainerMaker(axisBaseId, this.xscale,3, d3.axisBottom,gridTemplateCss)

            }]
        )

    }

    rescale(transform) {
        this.xscale = transform.rescaleX(this.originalX)
    }

}

