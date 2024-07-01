import os
import datetime
import tablib
from tablib import Dataset
from django.test import TestCase
from flowerapp.models import Item, TimeSeriesPlotPoint,Track
from flowerapp.time_span_utils import TimelineItemWidget, build_widgets_from_items, build_normalised_plot_points
from import_export import resources
from import_export.resources import ModelResource



class ItemModelTests(TestCase):
    
    def test_widget_list_with_correct_time_data(self):
        item1 = Item(name='hello', 
                           start=datetime.date(year=2000, month=12, day=25), 
                           startTime=None,
                           end=None, 
                           endTime=None)
        
        item2 = Item(name='hello2', 
                           start=datetime.date(year=2001,month=12,day=25), 
                           startTime=None,
                           end=None, 
                           endTime=None)
        
        templateFunction = lambda item : item.name + "1"
        
        widgetList = build_widgets_from_items([item1,item2], templateFunction,1)
        self.assertEqual(2, len(widgetList))
        self.assertEqual(widgetList[0].start.hour,0)
        self.assertEqual(widgetList[0].start.minute,0)        
        self.assertEqual(widgetList[0].start.year,2000)
        self.assertEqual(widgetList[0].start.month,12)
        self.assertEqual(widgetList[0].start.day,25)
        self.assertEqual(widgetList[0].end.hour,0)
        self.assertEqual(widgetList[0].end.minute,0)        
        self.assertEqual(widgetList[0].end.year,2001)
        self.assertEqual(widgetList[0].end.month,12)
        self.assertEqual(widgetList[0].end.day,25)        
        self.assertIsNotNone(widgetList[0].content)
        self.assertIsNotNone(widgetList[1].content)

        self.assertIsNotNone(widgetList[0].group)
        self.assertIsNotNone(widgetList[1].group)
        
        
    def test_for_serial_item_with_known_follower(self):
        currentItem = Item(name='hello', 
                           start=datetime.date(year=2000, month=12, day=25), 
                           startTime=None,
                           end=None, 
                           endTime=None)
        
        nextItem = Item(name='hello2', 
                           start=datetime.date(year=2001,month=12,day=25), 
                           startTime=None,
                           end=None, 
                           endTime=None)
        
        
        widget = TimelineItemWidget (item=currentItem,nextItem=nextItem,groupId=1,itemContent="empty")
        self.assertEqual(widget.start.hour,0)
        self.assertEqual(widget.start.minute,0)        
        self.assertEqual(widget.start.year,2000)
        self.assertEqual(widget.start.month,12)
        self.assertEqual(widget.start.day,25)
        
        self.assertEqual(widget.end.hour,0)
        self.assertEqual(widget.end.minute,0)        
        self.assertEqual(widget.end.year,2001)
        self.assertEqual(widget.end.month,12)
        self.assertEqual(widget.end.day,25)
        
        
    def test_for_serial_item_with_known_follower_with_date_and_time(self):
        currentItem = Item(name='hello', 
                           start=datetime.date(year=2000, month=12, day=25), 
                           startTime=None,
                           end=None, 
                           endTime=None)
        
        nextItem = Item(name='hello2', 
                           start=datetime.date(year=2001,month=12,day=25), 
                           startTime=datetime.time(hour=11,minute=30),
                           end=None, 
                           endTime=None)
        
        
        widget = TimelineItemWidget (item=currentItem,nextItem=nextItem,groupId=1,itemContent="empty")
        self.assertEqual(widget.start.hour,0)
        self.assertEqual(widget.start.minute,0)        
        self.assertEqual(widget.start.year,2000)
        self.assertEqual(widget.start.month,12)
        self.assertEqual(widget.start.day,25)
        
        self.assertEqual(widget.end.hour,11)
        self.assertEqual(widget.end.minute,30)        
        self.assertEqual(widget.end.year,2001)
        self.assertEqual(widget.end.month,12)
        self.assertEqual(widget.end.day,25)        
        


    def test_for_serial_item_with_its_own_end_date(self):
        currentItem = Item(name='hello', 
                           start=datetime.date(year=2000, month=12, day=25), 
                           startTime=None,
                           end=datetime.date(year=2001, month=12, day=25), 
                           endTime=None)
        
        
        widget = TimelineItemWidget (item=currentItem,nextItem=None,groupId=1,itemContent="hello")
        
        self.assertEqual(widget.start.hour,0)
        self.assertEqual(widget.start.minute,0)        
        self.assertEqual(widget.start.year,2000)
        self.assertEqual(widget.start.month,12)
        self.assertEqual(widget.start.day,25)
        
        self.assertEqual(widget.end.hour,0)
        self.assertEqual(widget.end.minute,0)        
        self.assertEqual(widget.end.year,2001)
        self.assertEqual(widget.end.month,12)
        self.assertEqual(widget.end.day,25)
        
    def test_for_serial_item_with_its_own_end_date_and_time(self):
        currentItem = Item(name='hello', 
                           start=datetime.date(year=2000, month=12, day=25), 
                           startTime=None,
                           end=datetime.date(year=2001, month=12, day=25), 
                           endTime=datetime.time(hour=11,minute=30))
        
        
        widget = TimelineItemWidget (item=currentItem,nextItem=None,groupId=1,itemContent='hello')
        
        self.assertEqual(widget.start.hour,0)
        self.assertEqual(widget.start.minute,0)        
        self.assertEqual(widget.start.year,2000)
        self.assertEqual(widget.start.month,12)
        self.assertEqual(widget.start.day,25)
        
        self.assertEqual(widget.end.hour,11)
        self.assertEqual(widget.end.minute,30)        
        self.assertEqual(widget.end.year,2001)
        self.assertEqual(widget.end.month,12)
        self.assertEqual(widget.end.day,25)        
        

    def test_for_serial_item_with_no_follower(self):
        currentItem = Item(name='hello', 
                           start=datetime.date(year=2000, month=12, day=25), 
                           startTime=None,
                           end=None, 
                           endTime=None)
        
        
        widget = TimelineItemWidget (item=currentItem,nextItem=None,groupId=1,itemContent="hello")
        
        self.assertEqual(widget.start.hour,0)
        self.assertEqual(widget.start.minute,0)        
        self.assertEqual(widget.start.year,2000)
        self.assertEqual(widget.start.month,12)
        self.assertEqual(widget.start.day,25)
        
        self.assertIsNone(widget.end)
        
    def test_for_normalisation_of_timeline(self):
        self.assertTrue(len(TimeSeriesPlotPoint.objects.all())==0)
        ts_resource:ModelResource = resources.modelresource_factory(model=TimeSeriesPlotPoint)()
        self.assertTrue(ts_resource is not None)
        self.assertEqual(len(self.imported_petrol_pump_data),339)
        trackId = Track.objects.all()[0].id        
        self.imported_petrol_pump_data.append_col(lambda x:trackId,header="track")        
        result = ts_resource.import_data(self.imported_petrol_pump_data, dry_run=False)
        self.assertFalse(result.has_errors())
        self.assertEqual(len(TimeSeriesPlotPoint.objects.all()),339)
        self.assertEqual(TimeSeriesPlotPoint.objects.all()[0].date.year,2018)
        self.assertAlmostEqual(TimeSeriesPlotPoint.objects.all()[0].value,120.19)
        self.assertEqual(TimeSeriesPlotPoint.objects.all()[338].date.year,2024)
        self.assertAlmostEqual(TimeSeriesPlotPoint.objects.all()[338].value,144.43)
        
        #get Track
        track1 = Track.objects.filter(id__exact=trackId)
        self.assertEqual(len(track1),1)
        childItems = TimeSeriesPlotPoint.objects.filter(track__id__exact=trackId)
        self.assertEqual(len(childItems),339)
        build_normalised_plot_points(childItems)
        


        
    @classmethod
    def setUpTestData(cls):        
        cwd = os.getcwd()
        print(cwd)
        # Set up data for the whole TestCase
        cls.Track = Track.objects.create(name='tst', itemType='EVE')
        # read timetrack csv
        
        pp = open("python\\flower\\flowerapp\\importdata\\petrol_pump.csv",'r')
        cls.imported_petrol_pump_data = Dataset().load(pp)
        
            
        
    
    
        

