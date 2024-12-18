import os

from pathlib import Path
import datetime

from typing import List

import tablib

from tablib import Dataset

from django.test import TestCase

from flowerapp.models import Item, TimeSeriesPlotPoint,Track

from flowerapp.eve_value_objects import EVE_track_constructor

from flowerapp.time_span_utils import build_widgets_from_items, build_normalised_plot_points,NormalisedTimeSeriesPlotPoint,TimelineItemWidget

from import_export import resources

from import_export.resources import ModelResource
import sys


  

class test_EVE(TestCase):

    fixtures = ["flowerapp_db.json"]
    

    def testTrackWithTimeSeriesData(self):
        event_track = Track.objects.get(pk='5')
        underTest = EVE_track_constructor(event_track)
        self.assertEqual('EVE', underTest.trackType)
        self.assertEqual('WarInUkrane',underTest.heading)

        self.assertEqual('5',underTest.id)
        self.assertEqual("2024-08-01",underTest.item.start)
        self.assertEqual("2024-08-02",underTest.item.end)
        self.assertEqual('5',underTest.item.id)
        
        self.assertEqual(2, len(underTest.item.events))
        self.assertEqual('Missile attacks across Crimean Peninsula', underTest.item.events[1].name)
        self.assertEqual('2024-08-02', underTest.item.events[1].date)
        self.assertIsNone(underTest.item.events[1].detail1)
        self.assertIsNone(underTest.item.events[1].detail2)
        self.assertIsNotNone(underTest.item.events[0].detail1)
        
        
        
        
              

        


