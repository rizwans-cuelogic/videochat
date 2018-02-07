// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................
var connection = new RTCMultiConnection();

// socket.io server
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.session = {
    'audio':true,
    'video':true
}

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio:true,
    OfferToReceiveVideo:true
}

// ......................................................
// ......................Handling Room-ID................
// ......................................................
// TODO : Manage from backend
var room_id = document.getElementById('roomid');
if (localStorage.getItem('room_id')) {
    room_id.value = localStorage.getItem('room_id');
} else {
    room_id.value = connection.token();
    localStorage.setItem('room_id', room_id.value);
}
document.getElementById('btn-open-or-join').onclick = function(){
    this.disabled = true;
    connection.openOrJoin(room_id.value || 'predefined-roomid');
}

// ......................................................
// ......................Global Variables................
// ......................................................
// TDOD : Try to remove these HTML variables
var common_button =`<button class="btn-mute btn-success"><img class="img-icon" src="static/tutorial/images/mute.png"></button>
                <button class="btn-plus btn-success"><img class="img-icon" src="static/tutorial/images/plus.png"></button>
                <button class="btn-minus btn-success"><img class="img-icon" src="static/tutorial/images/minus.png"></button>
                <button class="btn-full btn-success"><img class="img-icon" src="static/tutorial/images/fullscreen.png"></button>`

var owner_button =`<button class="btn-share btn-success"><img class="img-icon" src="static/tutorial/images/share.png"></button>
                    <button class="btn-exit btn-success"><img class="img-icon" src="static/tutorial/images/exit.png"></button>`

var streamid;
var localVideo = document.getElementById('local-video-container');
var remoteVideo = document.getElementById('remote-video-container');
var openButton= document.getElementById('btn-open-or-join');

connection.onstream = function(event){

    if(event.stream.isScreen === true && connection.isInitiator==true) {
            width = connection.videosContainer.clientWidth - 20;
            var share=document.getElementById('screen-local');
            share.appendChild(event.mediaElement);

            // var mediaElement = getMediaElement(event.mediaElement, {
            //     title: event.userid,
            //     buttons: ['full-screen'],
            //     width: width,
            //     showOnMouseEnter: false
            // });
            share.appendChild(event.mediaElement);
            mediaElement.id = event.streamid;
            return; 
     }
     if(event.stream.isScreen== true && event.type=="remote" && connection.isInitiator == false){

            var remote_share=document.getElementById('screen-remote');
            remote_share.appendChild(event.mediaElement);
            return;

    }

    if(event.stream.isScreen==true && connection.isInitiator==false && event.type=='local'){

        return;
    }
    var video = event.mediaElement;
    if(event.type === 'local'){
        var i;
        var html_video = document.createElement("div");
        html_video.classList.add("full-width");
        localVideo.appendChild(html_video);

        var elementdiv = document.createElement("div");
        elementdiv.classList.add("btnPanel");
        html_video.appendChild(elementdiv);

        $(localVideo).find('.btnPanel').html(common_button+owner_button);
        html_video.appendChild(video);
        var localStream = connection.attachStreams[0];
        localStream.mute('audio');
        addButtonEvent();
    }
    else if(event.type === 'remote'){
        var i;
        var html_video = document.createElement("div");
        html_video.classList.add("full-width");
        remoteVideo.appendChild(html_video);
        // it will create nave bar control append to nav bar
        var elementdiv = document.createElement("div");
        elementdiv.classList.add("btnPanel");
        html_video.appendChild(elementdiv);
        $(remoteVideo).find('.btnPanel').html(common_button);
        // append video div 
        html_video.appendChild(video);
        var localStream = connection.attachStreams[0];
        localStream.unmute('audio');
        addButtonEvent();
    }
    streamid = event.streamid; 
}


// ......................................................
// ......................Handling Events................
// ......................................................
connection.onEntireSessionClosed = function(event) {
    connection.attachStreams.forEach(function(stream) {
        stream.stop();
    });
};

connection.onstreamended = function(e) {
    if (!e.mediaElement) {
        e.mediaElement = document.getElementById(e.streamid);
    }
    if (!e.mediaElement || !e.mediaElement.parentNode) {
        return;
    }
    e.mediaElement.parentNode.remove();
};


// ......................................................
// ......................Custom Functions................
// ......................................................
function addButtonEvent(){
    $(".btn-exit").on("click",exit_fun);
    $(".btn-mute").on("click",mute_fun);
    $(".btn-plus").on("click",plus_fun);
    $(".btn-minus").on("click",minus_fun);
    $(".btn-full").on("click",full_fun);
    $(".btn-share").on("click",share_fun);
}

function mute_fun(){
    video = this.parentNode.nextElementSibling;
    connection.streamEvents[video.id].stream.mute('audio');
}

function full_fun(){
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
    video = this.parentNode.nextElementSibling;
    media_stream = connection.streamEvents[video.id].stream
    audiotrack  = media_stream.getAudioTracks()[0]

    if(audiotrack["enabled"] == false){
        connection.streamEvents[video.id].stream.unmute('audio');
        video.volume = 0.0
    }
    if((video.volume+0.1)<=1.0 ){
        video.volume= video.volume + 0.1;
    }
    if((video.volume+0.1)>1.0 ){
        video.volume= 1.0;
    }

}

function minus_fun(){    
    video = this.parentNode.nextElementSibling;
    if((video.volume-0.1)>=0.0 ){
        video.volume= video.volume - 0.1;
    }
    if((video.volume-0.1)<0.0 ){
        connection.streamEvents[video.id].stream.mute('audio'); 
    }
}

function exit_fun() {
    if (connection.isInitiator) {
        connection.closeEntireSession(function() {
            document.querySelector('h1').innerHTML = 'Entire session has been closed.';
            // TODO : Correct this code line for remove
            $('.btnPanel').remove();
        });
    } else {
        connection.leave();
        connection.attachStreams.forEach(function(stream) {
            stream.stop();
        });
    }
}

function share_fun(){

    this.disabled = true;
    connection.addStream({
        screen: true,
        oneway: true
    });
}

// document.getElementsByClassName('btn-share')[0].onclick = function() {

//     debugger;
//     connection.session['screen']=true
//     this.disabled = true;
//     connection.addStream({
//         screen: true,
//         oneway: true
//     });
// };
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