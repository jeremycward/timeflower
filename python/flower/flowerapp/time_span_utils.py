from datetime import datetime
from datetime import date
from dataclasses import dataclass
import numpy as np
from flowerapp.models import TimeSeriesPlotPoint

def date_time_combine(calendarDate,timeOfDay):
    ret_val = None
    if calendarDate !=None:
        ret_val = datetime.combine(calendarDate,datetime.min.time() if timeOfDay is None else timeOfDay)
    return ret_val            

class TimelineItemWidget:
    def __init__(self,item,nextItem,groupId,itemContent):        
        self.start =  date_time_combine(item.start,item.startTime)
        self.id = item.id
        self.group = groupId
        self.content =  itemContent
        
        if (item.end is not None):
            self.end = date_time_combine(item.end,item.endTime)
        else:
            if (nextItem is not None and nextItem.start is not None):
                self.end = date_time_combine(nextItem.start, nextItem.startTime)
            else:
                self.end = None    



    def as_map(self):
        return {"id" : self.id , 
               "start" : str(self.start), 
               "end": str(self.end), 
               "group": self.group, 
               "content": self.content,  
               "type" : "box" if self.end is None else "range"
               
                }
            
            
            
                  
                
                
            
def build_widgets_from_items(model_items,templateFunction,groupId):
    items = []
    for idx,thisItem in enumerate(model_items):                    
          itemContent = templateFunction(thisItem)          
          nextItem = None if  idx+1 >= len(model_items)  else model_items[idx+1]          
          items.append(TimelineItemWidget(thisItem,nextItem,groupId,itemContent))          
    return items      

def build_normalised_plot_points(plotPoints):
    
    dates = []
    values = []
    
    firstDate = plotPoints[0].date
    lastDate = plotPoints[len(plotPoints)-1].date 
    minTime = datetime.combine(firstDate,datetime.min.time())
    maxTime = datetime.combine(lastDate,datetime.min.time())
    
    maxDurationSeconds = (maxTime - minTime).total_seconds()
    
    
    for pp in plotPoints:
        startTime = date_time_combine (pp.date,datetime.min.time())
        durationFromStart = (startTime - minTime)
        normalisedDuration = durationFromStart.total_seconds() / maxDurationSeconds    
        dates.append(normalisedDuration)
        values.append(pp.value)            
        
        
        
    npArray = np.array([dates,values,plotPoints])  
    minValue =  np.min(npArray[1]) 
    maxValue = np.max(npArray[1])
    maxRange = maxValue - minValue

    for index, element in enumerate(npArray[1]) :
        normalisedValue = (element - minValue) / maxRange                  
        npArray[1][index]  = normalisedValue            
    
    return [ NormalisedTimeSeriesPlotPoint(pp=element[2],x=element[0],y=element[1] ) for element in np.transpose(npArray)]
    


@dataclass
class NormalisedTimeSeriesPlotPoint:
    x:float
    y:float
    pp:TimeSeriesPlotPoint
    
