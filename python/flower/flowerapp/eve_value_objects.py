import sys
from datetime import datetime
from datetime import date
from dataclasses import dataclass
import numpy as np
from flowerapp.models import TimeSeriesPlotPoint,Track
from flowerapp.global_timeflower_context import  formattedDate
from django import template

@dataclass
class EventItem:
    id: str
    name: str
    date: str
    detail1: str
    detail2: str
        
    

@dataclass
class EVE_item:
    start: str
    end: str
    id: str    
    events: [EventItem]



@dataclass
class EVE_track:
    trackType: str
    heading: str
    item: EVE_item
    id: str
    
            
    

def EVE_track_constructor(track):        
    eventItemsList = list(track.event_items())
    itemStart = eventItemsList[0].start
    itemEnd = eventItemsList[-1].start 
    events = [EventItem(
                        date=formattedDate(event.start),
                        name=event.name,
                        id=str(event.id),
                        detail1=event.detail1,
                        detail2=event.detail2)  
              for event in eventItemsList ]
    
            
    eveItem =  EVE_item(id = str(track.id),
                        start=formattedDate(itemStart),
                        end=formattedDate(itemEnd), 
                        events=events)    
    
    return EVE_track( item=eveItem,
                    trackType=track.itemType,
                    heading=track.name,
                    id=str(track.id))
                     
        
    
    
    
    
    
    
    

    
    
    