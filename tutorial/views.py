# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render,redirect
import uuid
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