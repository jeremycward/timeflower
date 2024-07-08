from django import template
from ..models import Track,Item
from ..time_span_utils import NormalisedTimeSeriesTrack, NormalisedTimeSeriesPlotPoint, build_normalised_plot_points,date_time_combine
register = template.Library()
import datetime as dt
from dataclasses import dataclass

def tfmt(dte):
    return dte.strftime("%Y-%m-%d %H:%M:%S")    


def dfmt(dte):
    return dte.strftime("%Y-%m-%d")    


@register.inclusion_tag("flowerapp/time_series_track.html")
def time_series_track(track):
    if len(track.time_series_items())==0:
        return {}
    norm_pp = build_normalised_plot_points(track.time_series_items())
    norm_track = NormalisedTimeSeriesTrack(
        start=dfmt(norm_pp[0].pp.date),
        end=dfmt(norm_pp[len(norm_pp)-1].pp.date),
        correlationId = track.id,
        track=track,
        name=track.name,
        normalisedPlotPoints= norm_pp)
    return {"normalised_track" :  norm_track}


@register.inclusion_tag("flowerapp/event_track.html")
def event_track(track):
    return {"eventTrack" : SequencedEventTrack(track)}        

def build_seq_items_from_model_items(model_items):
    items:list[SequencedEventItem] = []
    for idx,thisItem in enumerate(model_items):                          
          nextItem = None if  idx+1 >= len(model_items)  else model_items[idx+1]                    
          sei = SequencedEventItem(              
          )
          items.append(TimelineItemWidget(thisItem,nextItem,groupId,itemContent))          
    return items      


        
    
    
@dataclass
class SequencedEventItem:
    item: Item
    start:str
    end:str

    
    def __init__(self,item,nextItem):
        self.item = item
        self.start = tfmt(date_time_combine(item.start,item.startTime))
        if (item.end is not None):
            self.end = tfmt(date_time_combine(item.end,item.endTime))
        else:
            if (nextItem is not None and nextItem.start is not None):
                self.end = tfmt(date_time_combine(nextItem.start, nextItem.startTime))
            else:
                self.end = None    

        
@dataclass
class SequencedEventTrack:
    track: Track
    items: list[SequencedEventItem]
    def __init__(self,track):
        self.track = track
        items:list[SequencedEventItem] = []
        model_items = track.event_items()
        for idx,thisItem in enumerate(model_items):                          
          nextItem = None if  idx+1 >= len(model_items)  else model_items[idx+1]                              
          items.append(SequencedEventItem(thisItem,nextItem))             
        self.items =items
        
    
