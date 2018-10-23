// var initObj=null;
// var socket = io.connect(socketServer, {'transports': ['websocket']});
// var socket = io.connect(socketServer);
// var socket_got_connected = false;
// socket.on('connect', function(msg){
    // socket_got_connected=true;
    // console.log('Got connected!')
// });

var inputBoxInputs = document.querySelectorAll('.inputbox');
inputBoxInputs.forEach(inputBoxInput => {
    inputBoxInput.addEventListener('focus', function(){
        inputBoxInput.setAttribute('data-placeholder', inputBoxInput.getAttribute('placeholder'));
        inputBoxInput.setAttribute('placeholder', '');
    });
    inputBoxInput.addEventListener('blur', function(){
        inputBoxInput.setAttribute('placeholder', '');
        inputBoxInput.setAttribute('placeholder', inputBoxInput.dataset.placeholder);
    });
});
// document.querySelector('#inputbox').focus();

var player = null;
var initialVideoId;

function setUpYoutubePlayer(initialVideoId_) {
    console.log('setUpYoutubePlayer');
    initialVideoId = initialVideoId_;
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        // height: '320',
        // width: '500',
        playerVars: { autoplay: 1, controls: 1, loop: 1, enablejsapi: 1, rel: 0, autohide:1, modestbranding:1, mute:1 },
        // videoId: initialVideoId,
        events: {
            onReady: function(e) {
                playVid(initialVideoId);
            },
            onStateChange: function(e) {
                // console.log('Youtube player state changed: ', e);
                if (e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.UNSTARTED) {
                    player.playVideo();
                }
                if (e.data === YT.PlayerState.UNSTARTED) {
                }
            },
            onError: function(e){
                // console.error('Youtube player error: ', e);
            }
        }
    });
}

function playVid(posted_msg) {
    const rex_id = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+)/;
    const rex_playlist = /[&?]list=([^&]+)/i;
    const res_id = posted_msg.match(rex_id);
    const res_list = posted_msg.match(rex_playlist);
    const yt_id = res_id[1];
    const yt_list = res_list==null?null:res_list[1];

    // player.loadPlaylist(yt_id);
    player.loadVideoById(res_id[1]);
}
