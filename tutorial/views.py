# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render,redirect
import uuid
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings
import subprocess as sp
from models import RecordVideo

# Create your views here.

global_rooms = {}

class Room(object):
    def __init__(self, name, clients=[]):
        self.name = name
        self.clients = clients

    def __repr__(self):
        return self.name



def home(request):
	
	return render(request,'tutorial/index.html')
	

def createroom(request):

	room = str(uuid.uuid4().get_hex().upper()[0:6])
	return redirect('/room/'+room)


def room(request,room):

	return render(request,'tutorial/home.html') 

@csrf_exempt
def videoconverter(request):
	
	if request.method == "POST":

		file = request.FILES['file']

		recorded_file = RecordVideo(recorded_file=file)

		recorded_file.save()	

		import pdb
		pdb.set_trace()
		output_file_name = recorded_file.recorded_file.name.split(".")[0]
		input_file = settings.MEDIA_ROOT+'/'+recorded_file.recorded_file.name
		outputfile = settings.MEDIA_ROOT+'/'+output_file_name+'.mp4'

		try:
			sp.call(['ffmpeg','-i',input_file,'-crf','26','-strict','-2',outputfile])
			recorded_file.recorded_file = outputfile
			recorded_file.save()
			response = {"sucess":"successfully converted to mp4"}
			return HttpResponse(json.dumps(response),content_type='application/json')



		except Exception as e:

			response = {"Error":e}
			return HttpResponse(json.dumps(response),content_type='application/json')		
