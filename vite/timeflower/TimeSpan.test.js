
import * as d3 from 'd3';
import { TimeSpan } from './Timespan';

const headerWidth = 100
const vpWidth = 1000

export const makeScale = (startDate,endDate, vpWidth)=>{
    return d3.scaleTime()
    .domain([new Date(startDate), new Date(endDate)])
    .range([0, vpWidth]).nice()    

}


export const scales = {

    'LAST_CENTURY' :  makeScale('1900-01-01', '2000-01-01', vpWidth),
    'HENRY_VIII_REIGN' :makeScale('1491-01-01', '1547-01-01', vpWidth),
    'VICTORIA_REIGN' :makeScale('1819-05-24', '1901-01-18', vpWidth),
    'MOTHERS_LIFE' :makeScale('1945-10-10', '2020-02-02', vpWidth)
   

    }

export const makeTimeSpan=(startDate,endDate)=>new TimeSpan(new Date(startDate), new Date(endDate))    

test.only ('testGoldenPath',()=>{
    const underTest = makeTimeSpan('1900-01-01','1920-01-01')
    // expect (underTest.isVisibleInsideScale(scales.LAST_CENTURY,headerWidth)).toBe(true) 
    //  expect (underTest.isVisibleInsideScale(scales.HENRY_VIII_REIGN,headerWidth)).toBe(false) 
    expect (underTest.isVisibleInsideScale(scales.VICTORIA_REIGN,headerWidth)).toBe(true) 
    //  expect (underTest.isVisibleInsideScale(scales.MOTHERS_LIFE)).toBe(false) 

})

test ('testStartsOutside_EndsInside',()=>{
    const underTest = makeTimeSpan('1850-01-01','1920-01-01')    
    expect (underTest.isVisibleInsideScale(scales.LAST_CENTURY,headerWidth)).toBe(true) 

})

test ('testStartsInside_EndsOutside',()=>{
    const underTest = makeTimeSpan('1950-01-01','2020-01-01')    
    expect (underTest.isVisibleInsideScale(scales.LAST_CENTURY,headerWidth)).toBe(true) 

})

test ('testStartsOutside_EndsOutside',()=>{
    const underTest = makeTimeSpan('1650-01-01','2020-01-01')    
    expect (underTest.isVisibleInsideScale(scales.LAST_CENTURY,headerWidth)).toBe(true) 
})

test ('testStartsOutside_EndsOnTheNail',()=>{
    const FIFTIES = makeScale('1950-01-01','1960-01-01 00:00:00',1000)
    const underTest = makeTimeSpan('1960-01-01 00:00:00','1970-01-01')    
    expect (underTest.isVisibleInsideScale(FIFTIES,headerWidth)).toBe(false) 
})







