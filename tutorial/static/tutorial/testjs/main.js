// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................
var connection = new RTCMultiConnection();
var recordRTC;
var initiator_stream ;
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
// if (localStorage.getItem('room_id')) {
//     room_id.value = localStorage.getItem('room_id');
// } else {
    room_id.value = connection.token();
    // localStorage.setItem('room_id', room_id.value);
// }
document.getElementById('btn-open-or-join').onclick = function(){
    this.disabled = true;
    $('#roomid').prop('disabled',true);
    connection.openOrJoin(room_id.value || 'predefined-roomid');
}

// ......................................................
// ......................Global Variables................
// ......................................................
// TDOD : Try to remove these HTML variables
var common_button =`<button class="btn-mute btn-success"><img class="img-icon" src="static/tutorial/images/mute.png"></button>
                <button class="btn-plus btn-success"><img class="img-icon" src="static/tutorial/images/plus.png"></button>
                <button class="btn-minus btn-success"><img class="img-icon" src="static/tutorial/images/minus.png"></button>
                <button class="btn-full btn-success"><img class="img-icon" src="static/tutorial/images/fullscreen.png"></button>
            `
var owner_button =`<button class="btn-share btn-success"><img class="img-icon" src="static/tutorial/images/share.png"></button>
                    <button class="btn-exit btn-success"><img class="img-icon" src="static/tutorial/images/exit.png"></button>`

var recording_button = `<a class="btn btn-success btn-recording">Start Recording</a>
                        <a class="btn btn-success btn-stop-recodring">Stop Recording</a>`


//<button class="btn-recording btn-succss">record</button>
//<button class="btn-stop-recodring btn-succss">stop record</button>

var streamid;
var localVideo = document.getElementById('local-video-container');
var remoteVideo = document.getElementById('remote-video-container');
var openButton= document.getElementById('btn-open-or-join');

connection.onstream = function(event){
    debugger;
    if(connection.isInitiator==false){

        var recording_container = $('#recording-container');
        recording_container.html(recording_button);
        addRecordingEvent(recording_container);
        $(recording_container).find('.btn-stop-recodring').hide();
    }

    if(event.stream.isScreen === true && connection.isInitiator==true) {
        // width = connection.videosContainer.clientWidth - 120;
        //     var share=document.getElementById('screen-local');
        //     //share.appendChild(event.mediaElement);
        //     var mediaElement = getMediaElement(event.mediaElement, {
        //         title: event.userid,
        //         buttons: ['full-screen'],
        //         width: width,
        //         showOnMouseEnter: false
        //     });
        //     share.appendChild(mediaElement);
        //     mediaElement.id = event.streamid;
        return; 
    }
     if(event.stream.isScreen== true && event.type=="remote" && connection.isInitiator == false){
            debugger;
            width = connection.videosContainer.clientWidth - 120;
            var remote_share=document.getElementById('screen-remote');
            var mediaElement = getMediaElement(event.mediaElement, {
                title: event.userid,
                buttons: ['full-screen','mute-audio',
                          'take-snapshot',
                           'record-audio',
                           'record-video','volume-slider','stop'],
                width: width,
                showOnMouseEnter: false
            });
            remote_share.appendChild(mediaElement);
            //remote_share.appendChild(event.mediaElement);
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
        var selector = $(localVideo).find('.btnPanel');
        selector.html(common_button+owner_button);
        html_video.appendChild(video);
        var localStream = connection.attachStreams[0];
        localStream.mute('audio');
        addButtonEvent(selector);
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
        var selector = $(remoteVideo).find('.btnPanel'); 
        selector.html(common_button);
        // append video div 
        html_video.appendChild(video);
        var localStream = connection.attachStreams[0];
        localStream.unmute('audio');
        addButtonEvent(selector);
        $('html, body').animate({
            scrollTop: $(remoteVideo).offset().top
        },2000);
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
function addButtonEvent(selector){
    
    selector.find(".btn-exit").off("click");    
    selector.find(".btn-exit").on("click",exit_fun);
    selector.find(".btn-mute").off("click");
    selector.find(".btn-mute").on("click",mute_fun);
    selector.find(".btn-plus").off("click");
    selector.find(".btn-plus").on("click",plus_fun);
    selector.find(".btn-minus").off("click");
    selector.find(".btn-minus").on("click",minus_fun);
    selector.find(".btn-full").off("click");
    selector.find(".btn-full").on("click",full_fun);
    selector.find(".btn-share").off("click");
    selector.find(".btn-share").on("click",share_fun);
    selector.find(".btn-recording").off("click");
    selector.find(".btn-recording").on("click",record_fun);
    selector.find(".btn-stop-recodring").off("click");
    selector.find(".btn-stop-recodring").on("click",stop_record_fun);

}

function addRecordingEvent(selector){
    selector.find('.btn-recording').off("click");
    selector.find('.btn-recording').on("click",record_fun);
    selector.find(".btn-stop-recodring").off("click");
    selector.find(".btn-stop-recodring").on("click",stop_record_fun);
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

function record_fun(){
    debugger;
    // video = this.parentNode.nextElementSibling;
    // id = connection.streamEvents[video.id].stream.id
    // stream = connection.streamEvents[video.id].stream
    var recording_container = $('#recording-container');
    $(recording_container).find('.btn-recording').hide();
    recording_container.find('.btn-stop-recodring').show();
    alert("Recording Of Conference Is Started");
    var i;
    stream = connection.peers[connection.sessionid].streams[0]
    for(i=0;i<connection.getRemoteStreams().length;i++){
        if(stream == connection.getRemoteStreams()[i]){
            stream = connection.getRemoteStreams()[i];
            break;
        }
    }


    if(stream == undefined){
        console.log("stream is undefined")
    }

    
    //stream = connection.streamEvents[stream_id].stream
    // connection.streams[id].startRecording({
    //     audio: true,
    //     video: true
    // });

    var options = {
        mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        // audioBitsPerSecond: 128000,
        // videoBitsPerSecond: 128000,
        bitsPerSecond: 128000 // if this line is provided, skip above two
    };

    recordRTC = RecordRTC(stream, options);
    recordRTC.startRecording();


}

function stop_record_fun(){

//     video = this.parentNode.nextElementSibling;
//    connection.streams[video.id].stopRecording(function (blob) {
//     // POST both audio/video "Blobs" to PHP/other server using single FormData/XHR2
//     // blob.audio  --- audio blob
//     // blob.video  --- video blob
//     debugger;
// }, {audio:true, video:true} );
    var recording_container = $('#recording-container');
    $(recording_container).find('.btn-stop-recodring').hide();
    $(recording_container).find('.btn-recording').show();
    alert("Recording Of Conference Is Stop");
    var video =  document.getElementById('recording');
    recordRTC.stopRecording(function () {
        debugger;
        var recordedBlob = recordRTC.getBlob();
        var url = URL.createObjectURL(recordedBlob);
        // video.src = url;
        convertStreams(recordedBlob);
        window.open(url);


        // recordRTC.getDataURL(function(dataURL) { window.open(dataURL); });
    });
}
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
debugger;
var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
if(document.domain == 'localhost') {
    workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
}
function processInWebWorker() {
    debugger;
    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
        type: 'application/javascript'
    }));
    var worker = new Worker(blob);
    URL.revokeObjectURL(blob);
    return worker;
}
var worker;

function convertStreams(videoBlob) {
    var aab;
    var buffersReady;
    var workerReady;
    var posted;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        aab = this.result;
        postMessage();
    };
    fileReader.readAsArrayBuffer(videoBlob);
    if (!worker) {
        worker = processInWebWorker();
    }
    worker.onmessage = function(event) {
        var message = event.data;
        if (message.type == "ready") {
            log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
            workerReady = true;
            if (buffersReady)
                postMessage();
        } else if (message.type == "stdout") {
            log(message.data);
        } else if (message.type == "start") {
            log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
        } else if (message.type == "done") {
            log(JSON.stringify(message));
            var result = message.data[0];
            log(JSON.stringify(result));
            var blob = new File([result.data], 'test.mp4', {
                type: 'video/mp4'
            });
            log(JSON.stringify(blob));
            PostBlob(blob);
        }
    };
    var postMessage = function() {
        posted = true;
        worker.postMessage({
            type: 'command',
            arguments: '-i video.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4'.split(' '),
            files: [
                {
                    data: new Uint8Array(aab),
                    name: 'video.webm'
                }
            ]
        });
    };
}
function PostBlob(blob) {

    var inner = document.querySelector('.inner');
    var video = document.createElement('video');
    video.controls = true;
    var source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    source.type = 'video/mp4; codecs=mpeg4';
    video.appendChild(source);
    video.download = 'Play mp4 in VLC Player.mp4';
    inner.appendChild(document.createElement('hr'));
    var h3 = document.createElement('h3');
    h3.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4">Download Converted mp4</a>';
    inner.appendChild(h3);
    h3.style.display = 'block';
    inner.appendChild(video);
}
var logsPreview = document.getElementById('logs-preview');
function log(message) {
    // var li = document.createElement('li');
    // li.innerHTML = message;
    // logsPreview.appendChild(li);
    // li.tabIndex = 0;
    // li.focus();
    console.log(message);
}
window.onbeforeunload = function() {
    document.querySelector('#record-video').disabled = false;
};