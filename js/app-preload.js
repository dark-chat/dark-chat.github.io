var initObj=null;
// var socket = io.connect(socketServer, {'transports': ['websocket']});
var socket = io.connect(socketServer);
var socket_got_connected = false;
socket.on('connect', function(msg){socket_got_connected=true; console.log('Got connected!')});

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

var player;
var onYouTubeIframeAPIReady;

function setUpYoutubePlayer(initialVideoId) {
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            // height: '320',
            // width: '500',
            playerVars: { autoplay: 1, controls: 0, loop: 1 },
            // videoId: initialVideoId,
            events: {
                'onReady': (e)=> {playVid(initialVideoId)},
                // 'onStateChange': onPlayerStateChange
            }
        });
    }
}

function playVid(posted_msg) {
    const rex_id = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+)/;
    const rex_playlist = /[&?]list=([^&]+)/i;
    const res_id = posted_msg.match(rex_id);
    const res_list = posted_msg.match(rex_playlist);
    const yt_id = res_id[1];
    const yt_list = res_list==null?null:res_list[1];


    player.setLoop(true);
    player.loadPlaylist(yt_id);

    // if(yt_list){
    //     player.loadPlaylist({list: yt_list, listType:'search'});
    // }else{
    //     player.loadPlaylist(yt_id);
    // }

    player.setLoop(true);
}
