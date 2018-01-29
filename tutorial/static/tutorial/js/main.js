var connection = new RTCMultiConnection()

connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.session = {

    'audio':true,
    'video':true
}

connection.sdpConstraints.mandatory = {

    OfferToReceiveAudio:true,
    OfferToReceiveVideo:true
}

var room_id = document.getElementById('roomid')

var localVideo = document.getElementById('local-video-container')

var remoteVideo = document.getElementById('remote-video-container')


room_id.value = connection.token()

connection onstream = function(event){

	if(event.type === 'local')
	{
		localVideo.appendChild(video)
	}
	if(event.type === 'remote'){
		remoteVideo.appendChild(video)
	}

}

document.getElementById('btn-open-or-join').onclick = function(){
    this.disabled = true

    connection.openOrJoin('predefined-roomid')
}  