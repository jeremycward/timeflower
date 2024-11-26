from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),    
    path("time_line/", views.time_line, name="time_line"),    
    path("itemdetail/", views.itemdetail, name="item"),    
]