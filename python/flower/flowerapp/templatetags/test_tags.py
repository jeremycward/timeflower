from  .flower_tags import SequencedEventItem,SequencedEventTrack, event_track
from django.test import TestCase
from ..models import Track,Item
from datetime import  datetime, timedelta,date,time

test_dates = [
    date(2020,12,25),
    date(2020,12,26),
    date(2020,12,27)
]

class TagTests(TestCase):
    fixtures = ["tracks.json", "items.json","plotpoints.json"]
    
    def testSequencedEventItem(self):        
        #test with start only
        it1 = timeless_item(1,test_dates[0],None,None,None)
        it2 = timeless_item(2,test_dates[1],None,None,None)        
        sei = SequencedEventItem(it1,it2)
        self.assertEqual(sei.start,"2020-12-25 00:00:00")
        self.assertEqual(sei.end,"2020-12-26 00:00:00")
        
        #with start and start time only
        it1 = timeless_item(1,test_dates[0],time(12,33),None,None)
        it2 = timeless_item(1,test_dates[1],None,None,None)        
        sei = SequencedEventItem(it1,it2)
        self.assertEqual(sei.start,"2020-12-25 12:33:00")
        self.assertEqual(sei.end,"2020-12-26 00:00:00")
        
        #with start and start time and end time only
        it1 = timeless_item(1,test_dates[0],time(12,33),None,None)
        it2 = timeless_item(1,test_dates[1],time(12,33),None,None)        
        sei = SequencedEventItem(it1,it2)
        self.assertEqual(sei.start,"2020-12-25 12:33:00")
        self.assertEqual(sei.end,"2020-12-26 12:33:00")
        

        #with start date and end date only
        it1 = timeless_item(1,test_dates[0],None,None,None)
        it2 = timeless_item(1,test_dates[1],None,None,None)        
        sei = SequencedEventItem(it1,it2)
        self.assertEqual(sei.start,"2020-12-25 00:00:00")
        self.assertEqual(sei.end,"2020-12-26 00:00:00")
        
        
    def test_event_track(self):        
        track = Track.objects.get(id__exact=1)
        self.assertEqual(track.name,"UK Prime Ministers")    
        seqt = SequencedEventTrack(track)
        self.assertEqual(15, len(seqt.items))
        chamberlain = seqt.items[0]
        self.assertEqual(chamberlain.item.name,"Neville Chamberlain")
        self.assertEqual(chamberlain.start,"1937-05-28 00:00:00")
        self.assertEqual(chamberlain.end,"1940-05-10 00:00:00")
        blair = seqt.items[len(seqt.items)-1]
        self.assertEqual(blair.item.name,"Tony Blair")
        self.assertEqual(blair.start,"1997-05-02 00:00:00")
        self.assertIsNone(blair.end)
        self.assertEqual(blair.item.img,"https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Tony_Blair_in_2002_%28cropped%29.jpg/220px-Tony_Blair_in_2002_%28cropped%29.jpg")
        
        
        
        
        
        
        
        
        
        
        
def timeless_item(idx, start, startTime,end,endTime):
                return Item(
            name="name{}".format(idx),
            detail1="det1{}".format(idx),
            detail2=None,
            start = start,
            startTime=startTime,
            endTime = endTime,
            end = end
            
        )
