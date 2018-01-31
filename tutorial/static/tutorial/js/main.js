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

var all_button =`<button id="btn-mute">mute</button>
				<button id="btn-plus">plus</button>
            	<button id="btn-minus">minus</button>
           	 	<button id="btn-full">full</button>
            	<button id="btn-share">share</button>
            	<button id="btn-exit">ex</button>`

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

	if(event.type==='local')
	{
		debugger;
		var i;
		var elementdiv = document.createElement("div");
		elementdiv.classList.add("btnPanel");

		localVideo.appendChild(elementdiv);
		html = $.parseHTML( all_button );
		for(i=0; i<html.length;i++){
			elementdiv.appendChild(html[i]);
		}
		localVideo.appendChild(video);
		var localStream = connection.attachStreams[0];
		localStream.mute('audio');

		addButtonEvent();
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

function addButtonEvent(){
	debugger;
	$("#btn-exit").on("click",exit_fun);
	$("#btn-mute").on("click",mute_fun);
	$("#btn-plus").on("click",plus_fun);
	$("#btn-minus").on("click",minus_fun);
	$("#btn-full").on("click",full_fun);
	$("#btn-share").on("click",share_fun);
}



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

function mute_fun(){

}
function full_fun(){
	debugger;
	if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  	} else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
  }
}
function plus_fun(){

}
function share_fun(){

}
function minus_fun(){

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
	$('.btnPanel').remove();
	connection.close();
}

// debugger;
 //    if(!streamid) return;

	// var streamEvent = {streamid:streamid};
 // 	if(streamEvent) {
 //      connection.onstreamended( streamEvent );
 // 	}


