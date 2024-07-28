import json
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .time_span_utils import build_widgets_from_items  ,build_normalised_plot_points
from .models import Track, Item
from django.utils.safestring import SafeString
# Create your views here.
def itemdetail(request):
    template = loader.get_template("flowerapp/item_iframe.html")            
    itemid=request.GET.get('itemId')
    item= Item.objects.get(id__exact=itemid)
    additional_info = item.additional_info
    return HttpResponse(template.render({"info_url": additional_info},request))


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
       "timeline_data" : Track.objects.all()
   }

   return HttpResponse(template.render(context, request))

