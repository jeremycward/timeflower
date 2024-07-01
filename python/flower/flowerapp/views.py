import json
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .time_span_utils import build_widgets_from_items  
from .models import Track, Item
from django.utils.safestring import SafeString
# Create your views here.
def itemdetail(request):
    template = loader.get_template("flowerapp/item_iframe.html")            
    return HttpResponse(template.render({},request))


def index(request):
   tracks = []  
   itemWidgetsJson = []
   for thisTr in Track.objects.all():
      content =  loader.get_template("flowerapp/group.html").render({"track": thisTr})
      tracks.append({"id" : thisTr.id, "content" : content })      
      templ_function = lambda item : loader.render_to_string("flowerapp/item.html",{"item": item})
      model_items = Item.objects.filter(track__id__exact=thisTr.id).order_by('start')
      itemWidgets = build_widgets_from_items(model_items,templ_function,thisTr.id)      
      for widg in itemWidgets:
          itemWidgetsJson.append(widg.as_map())
          
          
          
        

   template = loader.get_template("flowerapp/flower.html")
   context = {
        "jsonGroups": SafeString(str(tracks)),
        "jsonItems" : SafeString(json.dumps(itemWidgetsJson))
   }

   return HttpResponse(template.render(context, request))

