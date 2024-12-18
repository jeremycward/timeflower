from django.test import TestCase
from django.template import loader
from .time_span_utils import build_widgets_from_items  ,build_normalised_plot_points
from bs4 import BeautifulSoup
from .models import Track, Item
TIMESERIES_ID_UNDER_TEST = '4_'
class TestTrackTemplate(TestCase):    
    
    fixtures = ["flowerapp_db.json"]
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
        self.assertEqual(len(track_items),22)        
        first_item = track_items[0]
        self.assertEqual("15", track_items[0].attrs['id'])
        self.assertEqual("Neville Chamberlain", track_items[0].attrs['name'])        
        self.assertEqual(track_items[0].attrs['start'],'1937-05-28 00:00:00')
        self.assertEqual(track_items[0].attrs['end'],'1940-05-10 00:00:00')
    
    
    def test_with_htmlx_TSE(self):    
            track = Track.objects.get(id__exact=4)                
            content =  loader.get_template("flowerapp/htmlx/timeline.html").render(
                {"timeline_data" : [track]}
            )
                        
            soup = BeautifulSoup(content)  
            tSETrackItem =soup.find("time-series-item")
            self.assertEqual('Cost of living',tSETrackItem['name'] )
            self.assertEqual('2018-01-01',tSETrackItem['start'] )
            self.assertEqual('2024-06-24',tSETrackItem['end'] )
            self.assertEqual(TIMESERIES_ID_UNDER_TEST,tSETrackItem['id'] )
            self.assertEqual(339, len(list(soup.find_all("time-series-plot"))))
            
            flowerTrackResult = soup.find_all("flower-track")
            self.assertEqual(len(flowerTrackResult),1)
            self.assertEqual(flowerTrackResult[0].attrs["heading"],"Cost of living")            
            self.assertEqual(flowerTrackResult[0].attrs["type"],"TSE")            
            self.assertEqual(flowerTrackResult[0].attrs["id"],"4")            
            self.assertEqual(flowerTrackResult[0].attrs["maxy"],"191.55")            
            self.assertEqual(flowerTrackResult[0].attrs["miny"],"104.87")            
            
            lastChild = list(soup.find_all("time-series-plot"))[0]
            self.assertEqual(lastChild.attrs["value"],"120.19")            
            self.assertEqual(lastChild.attrs["date"],"2018-01-01")            
            
            
            lastChild = list(soup.find_all("time-series-plot"))[1]
            self.assertEqual(lastChild.attrs["value"],"120.52")            
            self.assertEqual(lastChild.attrs["date"],"2018-01-08")            

            
    def test_with_htmlx_EVE(self):    
            track = Track.objects.get(name="WarInUkrane")                            
            content =  loader.get_template("flowerapp/htmlx/timeline.html").render(
                {"timeline_data" : [track]}
            )
            
            print(content) 
            soup = BeautifulSoup(content) 
            trackElement = soup.find('flower-track')
            self.assertEqual("eventline", trackElement.attrs['type'])
            self.assertEqual("WarInUkrane", trackElement.attrs['heading'])
            self.assertEqual("5", trackElement.attrs['id'])
            eveTrackItem = soup.find("track-item")                        
            self.assertEqual('2024-08-01',eveTrackItem['start'] )
            self.assertEqual('2024-08-02',eveTrackItem['end'] )
            self.assertEqual('5',eveTrackItem['id'] )
            
            
            eventItems = eveTrackItem.find_all('event-item')
            self.assertEqual(2, len(eventItems))
            self.assertEqual('Missile attacks across Crimean Peninsula', eventItems[1].attrs['name'])
            self.assertEqual('2024-08-02', eventItems[1].attrs['date'])
            self.assertEqual("",eventItems[1].attrs['detail1'])
            self.assertEqual("",eventItems[1].attrs['detail2'])
            self.assertEqual("Two people killed",eventItems[0].attrs['detail1'])
            
            
            
            
             

            
            
            
            
            # flowerTrackResult = soup.find_all("flower-track")
            # self.assertEqual(len(flowerTrackResult),1)
            # self.assertEqual(flowerTrackResult[0].attrs["heading"],"Cost of living")            
            # self.assertEqual(flowerTrackResult[0].attrs["type"],"TSE")            
            # self.assertEqual(flowerTrackResult[0].attrs["id"],"4")            
            # self.assertEqual(flowerTrackResult[0].attrs["maxy"],"191.55")            
            # self.assertEqual(flowerTrackResult[0].attrs["miny"],"104.87")            
            
            # lastChild = list(soup.find_all("time-series-plot"))[0]
            # self.assertEqual(lastChild.attrs["value"],"120.19")            
            # self.assertEqual(lastChild.attrs["date"],"2018-01-01")            
            
            
            # lastChild = list(soup.find_all("time-series-plot"))[1]
            # self.assertEqual(lastChild.attrs["value"],"120.52")            
            # self.assertEqual(lastChild.attrs["date"],"2018-01-08")            



            
            
            
            
            

            
        
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
        
        
        
        
        
        
        
        
        
    




        
        
        
        
        
        
        
        
       
        
        
                
        
        
        
