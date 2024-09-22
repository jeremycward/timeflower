import { TimeSpan } from "./Timespan"
import { GridPositionReckoner } from "./GridPositionReckoner"
import Handlebars from "handlebars"

const trackItemStrategy = (itemComp) => itemTemplateStrategies[itemComp.trackType]
const headerHtmlId = track => `${track.htmlId}_header`
const rowStripeElementId = track =>`${track.htmlId}_rowStripeElement`
const trackHeaderStrategy = (trackData) => itemTemplateStrategies[trackData.type]

const calc_offset_width = (xScale, range) => {
    var startOffset = xScale(range.start)
    var width = xScale(range.end) - xScale(range.start)
    return { startOffset: startOffset, width: width }
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
            (dataElement, xscale, itemHeight, itemIndex) => {
                const xPos = xscale(dataElement.date)
                return {
                    x: xPos,
                    idx: itemIndex,
                    name: dataElement.name
                }
            }

    },
    'TSE': {
        dataMapper: (dataElement, xScale, itemHeight,trackRenderingHints) => {
            const plotPoints = plot_points_from_ts_item_element(dataElement)
            const posn = calc_offset_width(xScale, TimeSpan.valueOf(dataElement))            
            const y = d3.scaleLinear()
                .domain(dataElement.parentNode.yDomain)
                .range([0, itemHeight]);

            var commandLine = ''
            for (const [index, pp] of plotPoints.entries()) {
                const commandCode = index > 0 ? 'L' : 'M'
                commandLine = ` ${commandLine} ${commandCode} ${xScale(pp.date)   - posn.startOffset} ${y(pp.value)}  `
            }

            let tickRules = y.ticks()
                .filter((el, item) => item % 2 == 0)
                .map((tck) => y(tck))

              return { 'path': commandLine, 'tickRules': tickRules, 'width': posn.width, id: `${dataElement.htmlId}Content` }
        }

    },
    'sequence': {
        dataMapper:
            (dataElement, xscale) => {
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
const defaultItemAttachFunction = (itemComp, xScale, trackHeight, itemIndex) => {
    const mappedData = dataMappers[itemComp.trackType].dataMapper(itemComp.dataElement, xScale, trackHeight, itemIndex)
    const trackItemHtml = trackItemTemplates[itemComp.trackType](mappedData)
    $(`#${itemComp.htmlId}`).append(trackItemHtml)
}
const defaultHeaderAttachFunction = (track) => {
    $(`#${headerHtmlId(track)}`).append(headingTemplates[track.type](track))
}

const itemTemplateStrategies = {
    'eventline': {
        attachTrackItem: defaultItemAttachFunction,
        refreshTrackItem: (itemContainer, xScale, trackHeight, itemIndex) => {
            $(`#${itemContainer.htmlId}`).css({
                display: itemContainer.display
            })
        },
        attachHeader: defaultHeaderAttachFunction,
        rowStripeDecorator: ()=>{},
        trackRenderingHints: (track)=>new Map()


    },
    'TSE': {
        attachTrackItem: defaultItemAttachFunction,
        refreshTrackItem: (itemContainer, xScale, trackHeight) => {
            const mappedData = dataMappers[itemContainer.trackType].dataMapper(itemContainer.dataElement, xScale, trackHeight)
            const trackItemHtml = trackItemTemplates[itemContainer.trackType](mappedData)
            $(`#${itemContainer.htmlId}Content`).replaceWith(trackItemHtml)
        },
        attachHeader: (track, trackHeight,trackRenderingHints) => {
            defaultHeaderAttachFunction(track, trackHeight)
            trackRenderingHints.set('yscale',d3.scaleLinear().domain(track.yDomain).range([0, trackHeight]))
            trackRenderingHints.set('ticks',5)
            d3.select('#' + track.timeSeriesAxisGutterId)
                .select('svg')
                .select('g')
                .attr('transform', 'translate(25,0)')
                .call(
                    d3.axisLeft(trackRenderingHints.get('yscale'))
                    .ticks(trackRenderingHints.get('ticks'))
                )
        },
        rowStripeDecorator: (trackData,trackRenderingHints)=>{
            const yscale = trackRenderingHints.get('yscale')    
            const ticks = yscale.ticks(trackRenderingHints.get('ticks'))
            const tickRules = ticks.map(it=>yscale(it))
            console.log(tickRules)
            $(`#${rowStripeElementId(trackData)}`).append(TSETrackTemplate({
                tickRules: tickRules,
                width: trackRenderingHints.get('viewportWidth')
            }))
        },
        trackRenderingHints: (track)=>new Map()
    },
    'sequence': {
        attachTrackItem: defaultItemAttachFunction,
        refreshTrackItem: (itemContainer, xScale, trackHeight) => {
            $(`#${itemContainer.htmlId}`).css({
                display: itemContainer.display
            })
        },
        attachHeader: defaultHeaderAttachFunction,
        rowStripeDecorator: ()=>{},
        trackRenderingHints: (track)=>new Map()
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

        this.trackHeight = 100
        this.viewportWidth = width
        this.dataElement = dataElement
        this.xscale = d3.scaleTime()
        this.originalX = this.xscale
            .domain(dataElement.range.domain())
            .range([0, width]).nice()

    }
    resize() {
        this.viewportWidth = $('#flowerViewport').width()
        this.redraw()
    }

    redraw() {
        const axisContainerMaker = (elementId, rowStart, rowEnd) => {
            const axisElement = $("<div>")
            axisElement.attr('id', elementId)
            axisElement.addClass("flowerAxis")
            axisElement.css({
                gridRowStart: rowStart,
                gridRowEnd: rowEnd,
                gridColumnStart: 'axis_start',
                gridColumnEnd: 'axis_end',

            })
            axisElement.append(emptySvg)

            return axisElement

        }
        const tracksCollection = this.dataElement.getTimeTracks()
        const rowCount = tracksCollection.length

        const reckoner = new GridPositionReckoner(this.xscale, tracksCollection)



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
        const gridTemplateRowsCss = `30px repeat(${rowCount},100px ) 30px`

        TimelineRenderer.newOrExistingItem('flowerGridWrapper',
        /*creatorFunc*/() => {

                $('#flowerTimeLineViewportContainer').append(
                    $('<div></div>')
                        .attr('id', 'flowerGridWrapper')
                        .css(
                            {
                                display: 'grid',
                                'grid-template-columns': gridTemplateCss,
                                gap: '2px',
                                gridTemplateRows: gridTemplateRowsCss,
                                columnRule: "4px dotted rgb(79 185 227)"


                            }
                        )
                )
                

                //row headers
                var rowCtr = 1
                this.dataElement.getTimeTracks().forEach(
                    (trackData) => {                        
                        const trackRenderingHints = trackHeaderStrategy(trackData).trackRenderingHints(trackData)
                        rowCtr++                        
                        trackRenderingHints.set('viewportWidth',this.viewportWidth )
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

                        trackHeaderStrategy(trackData).attachHeader(trackData, this.trackHeight,trackRenderingHints)

                        // row stripes
                        const rowStripeElement = $("<div></div")
                        rowStripeElement.css (
                            {
                            gridRowStart: `${rowCtr}`,
                            gridRowEnd: `${rowCtr}`,
                            gridColumnStart: 'axis_start',
                            gridColumnEnd: 'axis_end',
                            }
                        )
                        rowStripeElement.attr("id",rowStripeElementId(trackData))
                        rowStripeElement.addClass("rowStripe")

                        $('#flowerGridWrapper').append(rowStripeElement)
                        trackHeaderStrategy(trackData).rowStripeDecorator(trackData,trackRenderingHints)

                    }

                )
                // axes
                const axisTopId = 'flowerAxisTop'
                const axisBaseId = 'flowerAxisBase'
                $('#flowerGridWrapper').append(axisContainerMaker(axisTopId, '1', '1'))
                d3.select('#flowerAxisTop')
                    .select('svg')
                    .select('g')
                    .attr('transform', 'translate(0,20)')
                    .call(d3.axisTop(this.xscale))

                const baseAxisRowNumber = tracksCollection.length + 2
                $('#flowerGridWrapper').append(axisContainerMaker(axisBaseId, baseAxisRowNumber, baseAxisRowNumber))
                d3.select('#flowerAxisBase')
                    .select('svg')
                    .select('g')
                    .attr('transform', 'translate(0,10)')
                    .call(d3.axisBottom(this.xscale))


                // add each item

                var itemCtr = 1
                reckoner.itemComponentsAccumulator.components.forEach(itemContainer => {
                    $('#flowerGridWrapper')
                        .append(itemMapper(itemContainer))
                    trackItemStrategy(itemContainer).attachTrackItem(itemContainer, this.xscale, this.trackHeight, itemCtr++,trackRenderingHints)
                })

            },
        /*[updaterFunc])*/[() => {
                $('#flowerGridWrapper').css({
                    gridTemplateColumns: gridTemplateCss
                })
                reckoner.itemComponentsAccumulator.components.forEach(itemContainer => {
                    trackItemStrategy(itemContainer).refreshTrackItem(itemContainer, this.xscale, this.trackHeight)
                })
            }]
        )

    }

    rescale(transform) {
        this.xscale = transform.rescaleX(this.originalX)
    }

}

