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
    
    
    
    
    
    for pp in plotPoints:
        
        dates.append(date_time_combine (pp.date,datetime.min.time()))
        values.append(pp.value)
        
                
        
    npArray = np.array((dates,values))  
    minTime = npArray[0,0].time()
    maxTime =npArray[0,len(dates)-1].time()
    minValue =  np.min(npArray,1)[1]  
    maxValue = np.max(npArray,1)[1]
    
    print (minValue)   
    print (maxValue)
    print (minTime)
    print (maxTime)
    
    
    
        
        
    


@dataclass
class NormalisedTimeSeriesPlotPoint:
    x:int
    y:int
    date: datetime.date
    value: float
        
    
    
                
    
    
    
    
      
      
    

              
        

        
        

    
    
    
    
    
            
        
        
        
    
    