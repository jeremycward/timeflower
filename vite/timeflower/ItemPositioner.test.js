

import * as d3 from 'd3';



const makeScale = (startDate,endDate, vpWidth)=>{
    return d3.scaleTime()
    .domain([new Date(startDate), new Date(endDate)])
    .range([0, vpWidth]).nice()    

}



test ('getsNeg value for item before timedomain',()=>{

    expect (true).toBe(true)   
    const x = makeScale('2000-01-01','2010-01-01',100)
    var point = x(new Date('2005-01-01'))
    expect(Math.floor(point)).toBe(50)
    point = x(new Date('2000-01-01'))
    expect(point).toBe(0)
    point = x(new Date('1999-12-31'))
    expect(Math.floor(point)).toBe(-1)
    point = x(new Date('1990-01-01'))
    expect(Math.floor(point)).toBe(-100)

    point = x(new Date('0910-01-01'))
    expect(Math.floor(point)).toBe(-10899)


    point = x(new Date('9510-01-01'))
    expect(Math.floor(point)).toBe(75088)
    






    


    





})



