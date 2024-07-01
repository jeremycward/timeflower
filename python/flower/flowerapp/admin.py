from django.contrib import admin

from .forms import CustomTimeSeriesPlotPointImportForm,CustomConfirmTimeSeriesPlotPointImportForm
from .models import Track
from .models import Item
from .models import TimeSeriesPlotPoint
from import_export.fields import Field
from import_export.resources import ModelResource
from import_export.admin import ImportExportModelAdmin

# Register your models here.



class ItemInline(admin.TabularInline):
    ordering=['start']
    model = Item
    
class TsPlotPointInline(admin.TabularInline):
    ordering=['date']
    model = TimeSeriesPlotPoint


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    inlines =[ItemInline,TsPlotPointInline]
    
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    ordering=['start']
    
    
class TimeSeriesPlotPointResource(ModelResource) :
  
    def __init__(self, **kwargs):
        super().__init__()
        self.track_id = kwargs.get("track_id")    
        
    def before_save_instance(self, instance, row, **kwargs):   
        instance.track_id = int(kwargs.get('request')._post['track'])             
        return super().before_save_instance(instance, row, **kwargs)
    
    
    class Meta:
        model =TimeSeriesPlotPoint
        name="Import time series plot points"   
       
    
    
@admin.register(TimeSeriesPlotPoint)
class TimeSeriesAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    resource_class = TimeSeriesPlotPointResource
    import_form_class = CustomTimeSeriesPlotPointImportForm 
    
    

    
     
    
    
    