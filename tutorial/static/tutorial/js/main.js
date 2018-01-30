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

//var close_room = document.getElementById('roomid')
var streamid;
var localVideo = document.getElementById('local-video-container')

var remoteVideo = document.getElementById('remote-video-container')

var openButton= document.getElementById('btn-open-or-join')

connection.onstream = function(event){

	var video = event.mediaElement

	if(event.type==='local')
	{
		localVideo.appendChild(video)
		var localStream = connection.attachStreams[0];
		localStream.mute('audio')
		debugger;
	}
	if(event.type==='remote'){

		remoteVideo.appendChild(video)
		var localStream = connection.attachStreams[0];
		localStream.unmute('audio')
	}

	streamid = event.streamid; 
}

// connection.onstreamended = function(event) {
// 	debugger;
//     var video = document.getElementById(event.streamid);
//     if (video && video.parentNode) {
//         video.parentNode.removeChild(video);
//     }
// };

debugger;
room_id.value = connection.token()


document.getElementById('btn-open-or-join').onclick = function(){
    this.disabled = true;
	connection.openOrJoin(room_id.value || 'predefined-roomid');
}  

document.getElementById('btn-exit').onclick  = function() {
     
	if(connection.isInitiator){
		debugger;
		var remotelist = connection.getRemoteStreams()
		
		remotelist.forEach(function(remoteStream) {
			debugger;
        	remoteStream.stop();
        	connection.remove(remoteStream);
    	});

	}

	connection.attachStreams.forEach(function(localStream) {
        localStream.stop();
    });
	openButton.disabled = false;
	connection.close();


	// debugger;
 //    if(!streamid) return;

	// var streamEvent = {streamid:streamid};
 // 	if(streamEvent) {
 //      connection.onstreamended( streamEvent );
 // 	}

};



// panel for controls 
/*.btnPanel{
    position: fixed;
    top: 316px;
    width: 360px;
    background-color: gray;
    opacity: 0.7;
}*/