from django.conf.urls import url
from . import views


urlpatterns = [
	
	# url(r'^',views.home,name='home'),
	# url(r'^createroom/$',views.createroom,name='createroom'),
	url(r'^$', views.home, name="home"),
    url(r'^createroom/$', views.createroom, name='createroom'),
    url(r'^room/(?P<room>[^/]+)/$',views.room,name='room')

]