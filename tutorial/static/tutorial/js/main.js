document.getElementById('share-screen').onclick = function() {

	debugger;
	connection.session['screen']=true
    this.disabled = true;
    connection.addStream({
        screen: true,
        oneway: true
    });
};

var connection = new RTCMultiConnection()

connection.getScreenConstraints = function(callback) {
	debugger;
    getScreenConstraints(function(error, screen_constraints) {
        if (!error) {
            screen_constraints = connection.modifyScreenConstraints(screen_constraints);
            callback(error, screen_constraints);
            return;
        }
        throw error;
    });
};


connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.session = {

    'audio':true,
    'video':true,
}

connection.sdpConstraints.mandatory = {

    OfferToReceiveAudio:true,
    OfferToReceiveVideo:true
}

var room_id = document.getElementById('roomid')

var all_button =`<button class="btn-mute btn-success"><img class="img-icon" src="static/tutorial/images/mute.png"></button>
				<button class="btn-plus btn-success"><img class="img-icon" src="static/tutorial/images/plus.png"></button>
            	<button class="btn-minus btn-success"><img class="img-icon" src="static/tutorial/images/minus.png"></button>
           	 	<button class="btn-full btn-success"><img class="img-icon" src="static/tutorial/images/fullscreen.png"></button>
            	<button class="btn-share btn-success"><img class="img-icon" src="static/tutorial/images/share.png"></button>
            	<button class="btn-exit btn-success"><img class="img-icon" src="static/tutorial/images/exit.png"></button>`

var remote_button =`<button class="btn-mute btn-success btn-first"><img class="img-icon" src="static/tutorial/images/mute.png"></button>
				<button class="btn-plus btn-success"><img class="img-icon" src="static/tutorial/images/plus.png"></button>
            	<button class="btn-minus btn-success"><img class="img-icon" src="static/tutorial/images/minus.png"></button>
           	 	<button class="btn-full btn-success"><img class="img-icon" src="static/tutorial/images/fullscreen.png"></button>
            	`
var video_panel = `<div class="full-width"></div>`

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
	debugger;	
	 if(event.stream.isScreen === true) {
                width = connection.videosContainer.clientWidth - 20;
               	var share=document.getElementById('screen-share');
               	// share.appendChild(event.mediaElement);

                var mediaElement = getMediaElement(event.mediaElement, {
                    title: event.userid,
                    buttons: ['full-screen'],
                    width: width,
                    showOnMouseEnter: false
                });
                share.appendChild(event.mediaElement);
                mediaElement.id = event.streamid;
               	return;	
      }

	var video = event.mediaElement



	if(event.type==='local')
	{
	
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

		
		var i;
		

		// append div //
		// html_video_container =  $.parseHTML(video_panel);
		// for(i=0;i<html_video_container.length;i++){

		// 	remoteVideo.appendchild(html_video_container[i])
		// }

		var html_video = document.createElement("div");
		html_video.classList.add("full-width");
		remoteVideo.appendChild(html_video);


		debugger;
		// it will create nave bar control append to nav bar
		var elementdiv = document.createElement("div");
		elementdiv.classList.add("btnPanel");
		

		html_video.appendChild(elementdiv);
		html = $.parseHTML( remote_button );
		for(i=0; i<html.length;i++){
			elementdiv.appendChild(html[i]);
		}

		// append video div 
		html_video.appendChild(video)
		
		var localStream = connection.attachStreams[0];
		localStream.unmute('audio');
		addButtonEvent();
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
	$(".btn-exit").on("click",exit_fun);
	$(".btn-mute").on("click",mute_fun);
	$(".btn-plus").on("click",plus_fun);
	$(".btn-minus").on("click",minus_fun);
	$(".btn-full").on("click",full_fun);
	$(".btn-share").on("click",share_fun);
}



// function exit_fun() {
     
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

function mute_fun(){
	debugger;
	localStream = connection.streamEvents.selectFirst()
	localStream.stream.mute('audio'); 
}
function full_fun(){
	debugger;
	
	video = this.parentNode.nextElementSibling; 

	if (video.webkitRequestFullScreen) {
      video.webkitRequestFullScreen();
  	} else {
    if (video.webkitexitFullscreen) {
      video.webkitexitFullscreen(); 
    }
  }
}
function plus_fun(){
	debugger;
	video = this.parentNode.nextElementSibling;

	if(video.volume != 1.0){
		video.volume= video.volume + 0.1;
	}

}
function share_fun(){

}
function minus_fun(){
	debugger;
	video = this.parentNode.nextElementSibling;
	if(video.volume != 0.0){
		video.volume= video.volume - 0.1;
	}
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
    debugger;
	if(connection.isInitiator){
		
		var remotelist = connection.getRemoteStreams()
		
		remotelist.forEach(function(remoteStream) {
			debugger;
        	remoteStream.stop();
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


