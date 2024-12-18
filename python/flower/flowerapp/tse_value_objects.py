import sys
from datetime import datetime
from datetime import date
from dataclasses import dataclass
import numpy as np
from flowerapp.models import TimeSeriesPlotPoint,Track
from django import template
from flowerapp.global_timeflower_context import formattedDate

@dataclass
class Time_series_plot:
    value: str
    date: str
    

@dataclass    
class Time_series_item:
    name: str
    id: str
    start:str
    end:str
    plots: [Time_series_plot]
    
@dataclass
class TSE_track:
    trackType: str
    heading: str
    item: Time_series_item
    id: str
    maxY: str
    minY: str
    
        
def TSE_track_constructor(track):
        ts_items = track.time_series_items()        
        minValue = sys.float_info.max
        maxValue = sys.float_info.min                
        plots = []    
        
        for ts_item in list(ts_items):                  
            minValue = ts_item.value if ts_item.value < minValue  else minValue
            maxValue = ts_item.value   if ts_item.value > maxValue else maxValue
            pp = Time_series_plot(date=formattedDate(ts_item.date),value=str(ts_item.value))
            plots.append(pp)                        
        
        start = None if not plots else plots[0].date
        end = None if not plots else plots[len(ts_items)-1].date
        ts_item = Time_series_item(name= track.name,
                                   id=str(track.id),
                                   plots=plots,
                                   start=start,
                                   end=end
                                   )            
        
        tse_track = TSE_track(
            heading= track.name,
            trackType=track.itemType, 
            item= ts_item,
            id=str(track.id),
            maxY=str(maxValue),
            minY=str(minValue)
        )
        
        return tse_track
        
        
               
            
            



    
    
    
        
    
    
    
    
    
    
    
    
    
