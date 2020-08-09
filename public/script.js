
const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;

var peer = new Peer(undefined, {
    host: '/',
    port: 443,
    path: '/peerjs'
});
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {

    /**
     * out stream
     */
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });

}).catch((err) => {

})
peer.on('open', id => {
    socket.emit('join-room', room_id, id);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}


// input value
let text = $("input");
// when press enter send message
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
      console.log(text.val());
    socket.emit('message', text.val());
    text.val('')
  }
});

socket.on('createMessage',message=>{
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
})
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnMuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}
const setUnMuteButton = () => {
    const html = `<i class="fas fa-microphone-slash unmute"></i> <span>Unmute</span>`;
    document.querySelector('.main__mute_button').innerHTML = html;
}
const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i> <span>Mute</span>`;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setStopVideo();
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;        
        setPlayVideo();
    }
}

const setPlayVideo = () => {
    const html = `<i class="fas fa-video"></i> <span>Stop Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;
}
const setStopVideo = () => {
    const html = `<i class="fas fa-video-slash unmute"></i> <span>Play Video</span>`;
    document.querySelector('.main__video_button').innerHTML = html;
}




