from django.test import TestCase
from django.template import loader
from bs4 import BeautifulSoup
from .models import Track, Item
class TestTrackTemplate(TestCase):    
    fixtures = ["tracks.json", "items.json"]
    def test_with_no_tracks(self):        
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" :[]})
        self.assertTrue(content is not  None)
        print(content)
        soup = BeautifulSoup(content)
        result = soup.find_all("flower-track")
        self.assertEqual(len(result),0)
        
        
    def test_with_one_track__EVE(self):
        track = Track.objects.get(id__exact=1) 
        
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" :[track]})
        soup = BeautifulSoup(content)
        result = soup.find_all("flower-track")
        self.assertEqual(len(result),1)
        self.assertEqual(result[0].attrs['type'], 'SER')
        self.assertEqual(result[0].attrs['id'], '1')
        track_items = soup.find_all("track-item")
        time_series_items = soup.find_all("time-series-item")
        self.assertEqual(len(time_series_items),0)
        self.assertEqual(len(track_items),15)
        first_item = track_items[0]
        self.assertEqual("Ted Heath", track_items[0].attrs['name'])
        self.assertEqual("Cons.", track_items[0].attrs['detail1'])
        self.assertEqual(track_items[0].attrs['detail2'],'')
        
        
    def test_with_one_track__TSE(self):
        track = Track.objects.get(id__exact=3)         
        content =  loader.get_template("flowerapp/timeline.html").render({"tracks" :[track]})
        soup = BeautifulSoup(content)
        result = soup.find_all("flower-track")
        self.assertEqual(len(result),1)
        track_items = soup.find_all("track-item")
        self.assertEqual(len(track_items),0)
        
        time_series_items = soup.find_all("time-series-item")
        self.assertEqual(len(time_series_items),1)
        
        
        
        
       
        
        
                
        
        
        
