import os

from pathlib import Path
import datetime

from typing import List

import tablib

from tablib import Dataset

from django.test import TestCase

from flowerapp.models import Item, TimeSeriesPlotPoint,Track

from flowerapp.tse_value_objects import TSE_track_constructor,TSE_track,Time_series_item,Time_series_plot

from flowerapp.time_span_utils import build_widgets_from_items, build_normalised_plot_points,NormalisedTimeSeriesPlotPoint,TimelineItemWidget

from import_export import resources

from import_export.resources import ModelResource

import sys




class test_TSE(TestCase):

    fixtures = ["tracks.json", "items.json","plotpoints.json"]
    

    def testTrackWithTimeSeriesData(self):

        tracks = Track.objects.all()        
        tse_track_under_test = TSE_track_constructor(tracks[3])        

        self.assertEqual("191.55",tse_track_under_test.maxY)
        self.assertEqual("104.87",tse_track_under_test.minY)        
        self.assertEqual(339,len(tse_track_under_test.item.plots))
        self.assertEqual('TSE', tse_track_under_test.trackType)
        self.assertEqual('4', tse_track_under_test.id)
        self.assertEqual('Cost of living', tse_track_under_test.heading)
        
        tse_item_under_test = tse_track_under_test.item
        self.assertEqual('Cost of living',tse_item_under_test.name)        
        self.assertEqual('4',tse_item_under_test.id)
        self.assertEqual('2018-01-01', tse_item_under_test.start)
        self.assertEqual('2024-06-24', tse_item_under_test.end)
        
        plotItem30 = tse_track_under_test.item.plots[30]
        self.assertEqual('127.54', plotItem30.value)
        self.assertEqual('2018-07-30',plotItem30.date)
        
        
        plotItem330 = tse_track_under_test.item.plots[330]
        self.assertEqual('149.49', plotItem330.value)
        self.assertEqual('2024-04-29',plotItem330.date)

        


