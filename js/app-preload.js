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

var player=null;
var initialVideoId=null;
var currentVideoId=null;

function setUpYoutubePlayer(initialVideoId_) {
    console.log('setUpYoutubePlayer');
    initialVideoId = initialVideoId_;
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

function onYouTubeIframeAPIReady() {
    console.log('onYouTubeIframeAPIReady');
    player = new YT.Player('player', {
        // height: '320',
        // width: '500',
        playerVars: { autoplay: 1, controls: 1, loop: 1, enablejsapi: 1, rel: 0, autohide:1, modestbranding:1 },
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
    console.log('playVid');
    const rex_id = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+)/;
    const rex_playlist = /[&?]list=([^&]+)/i;
    const res_id = posted_msg.match(rex_id);
    const res_list = posted_msg.match(rex_playlist);
    const yt_id = res_id[1];
    const yt_list = res_list==null?null:res_list[1];

    // player.loadPlaylist(yt_id);
    player.loadVideoById(res_id[1]);
}

function isDefined(val) {
    return typeof val!=="undefined";
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var log = console.log;



var particles = [];

class Particle {
    constructor(x, y, xVel, yVel) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;

        this.element = document.createElement("div");
        document.getElementById("particles").appendChild(this.element);

        particles.push(this);
    }

    tick() {
        this.x += this.xVel;
        this.y += this.yVel;

        this.element.style.top = this.y + "px";
        this.element.style.left = this.x + "px";

        if (this.x < 0 || this.x > innerWidth || this.y < 0 || this.y > innerHeight) {
            // this.delete();
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * innerWidth;
        this.y = 0;
        this.xVel = Math.random() - 0.5;
        this.yVel = Math.max(Math.random() * 2, 0.25);
    }

    delete() {
        particles.splice(particles.indexOf(this), 1);
        document.getElementById("particles").removeChild(this.element);
    }
}

class Snow extends Particle {
    constructor() {
        super(Math.random() * innerWidth, 0, Math.random() - 0.5, Math.max(Math.random() * 2, 0.25));
        this.element.className = "snow";
    }
}

setInterval(function() {
    if (particles.length > 50) return;

    new Snow();
}, 80);

function render() {
    particles.forEach(function (particle) {
        particle.tick();
    });
    requestAnimationFrame(render);
}

requestAnimationFrame(render);