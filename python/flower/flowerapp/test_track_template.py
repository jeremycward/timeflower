from django.test import TestCase
from django.template import loader
from .time_span_utils import build_widgets_from_items  ,build_normalised_plot_points
from bs4 import BeautifulSoup
from .models import Track, Item
class TestTrackTemplate(TestCase):    
    fixtures = ["tracks.json", "items.json","plotpoints.json"]
    def test_with_no_tracks(self):        
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" :[]})
        self.assertTrue(content is not  None)        
        soup = BeautifulSoup(content)
        result = soup.find_all("flower-track")
        self.assertEqual(len(result),0)
        
        
    def test_with_one_track__EVE(self):
        track = Track.objects.get(id__exact=1)         
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" : [track] })
        soup = BeautifulSoup(content)
        result = soup.find_all("flower-track")
        self.assertEqual(len(result),1)
        self.assertEqual(result[0].attrs['type'], 'sequence')
        self.assertEqual(result[0].attrs['id'], '1')
        track_items = soup.find_all("track-item")
        time_series_items = soup.find_all("time-series-item")
        self.assertEqual(len(time_series_items),0)
        self.assertEqual(len(track_items),15)
        
        first_item = track_items[0]
        self.assertEqual("15", track_items[0].attrs['id'])
        self.assertEqual("Neville Chamberlain", track_items[0].attrs['name'])        
        self.assertEqual(track_items[0].attrs['start'],'1937-05-28 00:00:00')
        self.assertEqual(track_items[0].attrs['end'],'1940-05-10 00:00:00')
        
        
        
    def test_with_one_track__TSE(self):
        track = Track.objects.get(id__exact=4)                
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" : [track]})
        soup = BeautifulSoup(content)  
        result = soup.find_all("flower-track")
        self.assertEqual(len(result),1)
        track_items = soup.find_all("track-item")
        self.assertEqual(len(track_items),0)
        
        time_series_items = soup.find_all("time-series-item")
        self.assertEqual(len(time_series_items),1)
        self.assertEqual(time_series_items[0].attrs["correlationid"],"4")
        self.assertEqual(time_series_items[0].attrs["name"],"Cost of living")
        self.assertEqual(time_series_items[0].attrs["start"],"2018-01-01")
        self.assertEqual(time_series_items[0].attrs["end"],"2024-06-24")
        
        
        time_series_plot_points = soup.find_all("time-series-plot")
        self.assertEqual(len(time_series_plot_points),339)
        self.assertEqual(time_series_plot_points[235].attrs["value"],"191.55")
        self.assertEqual(time_series_plot_points[235].attrs["y"],"1.0")
        self.assertEqual(time_series_plot_points[235].attrs["x"],"0.6952662721893491")
        self.assertEqual(time_series_plot_points[235].attrs["date"],"July 4, 2022")
        
        
    def test_with_all_tracks(self):
        tracks = Track.objects.all()
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" :tracks})
        print(content)
        soup = BeautifulSoup(content)  
        root_result = soup.find_all("flower-time-line")
        self.assertEqual(len(root_result),1)
        
        
        
        
        
    




        
        
        
        
        
        
        
        
       
        
        
                
        
        
        
