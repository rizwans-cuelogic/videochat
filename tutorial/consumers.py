import re
import json
import logging
from channels import Group
from channels.sessions import channel_session
from .views import Room,global_rooms


log = logging.getLogger(__name__)


@channel_session
def ws_connect(message):
    # Extract the room from the message. This expects message.path to be of the
    # form /chat/{label}/, and finds a Room if the message path is applicable,
    # and if the Room exists. Otherwise, bails (meaning this is a some othersort
    # of websocket). So, this is effectively a version of _get_object_or_404.
    print message['path']
    prefix, label = message['path'].decode('ascii').strip('/').split('/')
    print prefix,label

    if prefix != 'room':
        log.debug('invalid ws path=%s', message['path'])
        return

    if label in global_rooms:
        global_rooms[label].clients.append("client1")

    else:
        global_rooms[label] = Room(label, ["client1"])

    # if len(self.room.clients) > 2:
        
            
    # elif len(self.room.clients) == 1:
        
    message.channel_session['room'] = label    




@channel_session
def ws_receive(message):
    # Look up the room from the channel session, bailing if it doesn't exist
    pass

@channel_session
def ws_disconnect(message):
    pass