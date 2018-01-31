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


var exit_bt = document.getElementById('btn-exit');

if (exit_bt != null){
	exit_bt.style.display="none";
}
connection.onstream = function(event){

	var video = event.mediaElement

	// if (video.hasAttribute("controls")) {
 //    	video.removeAttribute("controls");   
 //  	}    

	if(event.type==='local')
	{
		var elementdiv = document.createElement("div");
		elementdiv.classList.add("btnPanel");
		var elementbt = document.createElement("button");
		elementbt.setAttribute("id", "btn-exit");
		var t = document.createTextNode("Exit");
		elementbt.onclick = exit_fun
		elementbt.appendChild(t);
		localVideo.appendChild(elementdiv);
		elementdiv.appendChild(elementbt);
		localVideo.appendChild(video);
		var localStream = connection.attachStreams[0];
		localStream.mute('audio');

		if(exit_bt != null){
			exit_bt.style.display="block";
		}		
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


room_id.value = connection.token()


document.getElementById('btn-open-or-join').onclick = function(){
    this.disabled = true;
	connection.openOrJoin(room_id.value || 'predefined-roomid');
}  


// document.getElementById('btn-exit').onclick  = function() {
     
// 	if(connection.isInitiator){
// 		debugger;
// 		var remotelist = connection.getRemoteStreams()
		
// 		remotelist.forEach(function(remoteStream) {
// 			debugger;
//         	remoteStream.stop();
//         	connection.remove(remoteStream);
//     	});

// 	}

// 	connection.attachStreams.forEach(function(localStream) {
//         localStream.stop();
//     });
// 	openButton.disabled = false;
// 	connection.close();
// }

function exit_fun() {
     
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
}


// document.getElementById('btn-exit').onclick = function() {
     
// 	if(connection.isInitiator){
// 		debugger;
// 		var remotelist = connection.getRemoteStreams()
		
// 		remotelist.forEach(function(remoteStream) {
// 			debugger;
//         	remoteStream.stop();
//         	connection.remove(remoteStream);
//     	});

// 	}

// 	connection.attachStreams.forEach(function(localStream) {
//         localStream.stop();
//     });
// 	openButton.disabled = false;
// 	connection.close();
// }

function exit_fun() {
     
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
}


	// debugger;
 //    if(!streamid) return;

	// var streamEvent = {streamid:streamid};
 // 	if(streamEvent) {
 //      connection.onstreamended( streamEvent );
 // 	}


