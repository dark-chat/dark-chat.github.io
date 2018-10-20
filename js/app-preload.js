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

function playVid(id) {
    if(!player.loadPlaylist) debugger;
    player.setLoop(true);
    player.loadPlaylist(id);
}
