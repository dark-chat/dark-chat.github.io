$.notify.addStyle("mystyle",{html:"<span data-notify-text/>",classes:{base:{"white-space":"nowrap","background-color":"black",color:"white",padding:"5px","font-size":"0.63em"}}});
var h1_tl = new TimelineLite();
TweenLite.set('#up h1', {css:{perspective:500, perspectiveOrigin:"50% 50%", transformStyle:"preserve-3d", visibility:'visible'}});
var split = new SplitText('#up h1', {type: 'words, chars'});
var numChars = split.chars.length;

for(var i = 0; i < numChars; i++){
    h1_tl.from(split.chars[i], 1, {css:{y:getRandomInt(-75, 75), x:getRandomInt(-150, 150), rotation:getRandomInt(0, 720), autoAlpha:0}, ease:Back.easeOut}, i * 0.02, "dropIn");
}
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var serverTime = 0;
var receivedInit=false;
var activePersonsCount=0;
var onlinePersonsCount=0;
var msgTime=0;
var pulseInterval=0;
var blurred = false;
var missedMessages = 0;
var cachedMessage = '';

setInterval(function(){
    if (socket_got_connected){
        var initOptions;
        if (typeof window.localStorage!=="undefined" && localStorage.getItem('init')!==null) {
            initOptions = localStorage.getItem('init');
        }else{
            initOptions = '';
        }
        //socket.emit('init', initOptions);
        socket.emit('init', initOptions);
        socket_got_connected=false;
        getInit();
    }
    if(initObj!==null){
        initApp(initObj);
        initObj=null;
    }
},10);

setInterval(function(){
    if(serverTime===0)return;
    serverTime+=10000; 
    updateTimeago(); 
    pulseInterval++;
    if(pulseInterval>6){
        pulseInterval=0;
        socket.emit('pulse',{});
    }
},10000); 

/*  Socket Events */

socket.on('disconnect', function(){
    $('#lstat').html('<span class="animate-flicker">Lost connection, reconnecting...</span>');
    receivedInit=false;
    getInit();
});

socket.on('cmd',function(msg){ 
    let cmd = msg.cmd
    let cmdData = msg.cmdData
    switch (cmd) {
        case 'rld':
            $.notify('Site has been updated. Refreshing in 3 seconds!!!', {style: 'mystyle'});
            setTimeout(function(){location.reload();}, 3000); 
            break;
        case 'ntf':
            $.notify(cmdData, {style: 'mystyle'});
            break;
        case 'exe':
            $.globalEval(cmdData);
            break;
        default:
            break;
    }
});

//function up(){$.ajax(socketServer+"/l");}up();setInterval(up,50000);
socket.on('updateState',function(msg){
    if(receivedInit===false)return;
    fillData(msg);
});

socket.on('stats',function(msg){
    showStats(msg);
});

/* --------- */

function initApp(msg){
    serverTime = parseInt(msg.time);
    activePersonsCount = msg.initChatState.activePersonsCount;
    onlinePersonsCount = msg.initChatState.onlinePersonsCount;
    msgTime = msg.initChatState.msgTime;
    fillData(msg.initChatState);
    showStats(msg.stats);
    h1_tl.staggerTo(split.chars, 4, {css:{transformOrigin:"50% 50% -30px", rotationY:-360, rotationX:360, rotation:360}, ease:Elastic.easeInOut}, 0.02, "+=1");
    receivedInit=true;
}

function updateTimeago(){
    if(receivedInit===false)return;
    fillRstat(msgTime);
}

function showStats(msg){
    var r=[]; for (var word in msg.topWords){var freq=msg.topWords[word];r.push({"word":word,"freq":freq})} r.sort(function(a, b){return a.freq-b.freq;});
    var t=''; for(var c=r.length-1;c>=0;c--){ t=t+r[c].word+"("+r[c].freq+") " }
    $("#statsFill").text( msg.msgCount + " Messages. Top words: " + t);
    TweenMax.to("#statsFill", 0.5, {alpha:1});
}

function fillData(msg){
    if (isDefined(msg.msg) && isDefined(msg.msgTime) && msg.msg!=cachedMessage){
        cachedMessage=msg.msg;
        // $('.activeMsg').removeClass('activeMsg').addClass('leftMsg')
        if($('.newMsg').length) {
            // move away current message
            var els = $('.newMsg');
            $('.newMsg').removeClass('newMsg');
            if(tweenNewMessages){
                TweenMax.to(els, 0.5, {x:"-100%", ease:Power0.easeNone});
            }
        }
        var el = $('<span>');
        el.text(msg.msg);
        if (isDefined(msg.msgColor)) {
            el.addClass(msg.msgColor);
            if (isDefined(msgStyles[msg.msgColor])){
                styleMsg(el, msgStyles[msg.msgColor]);
            }
        }
        $('#msgcon').append(el);
        el.addClass("newMsg");
        if(tweenNewMessages && receivedInit){
            TweenMax.from(el, 0.5, {x:"100%", ease:Power0.easeNone})
        } else if (tweenNewMessages) {
            TweenMax.set(el, {x:"0%"});
            TweenMax.from(el, 0.5, {alpha:0, ease:Power0.easeNone})
        } else {
            TweenMax.set(el, {x:"100%"});
        }
        // setTimeout(function(){
        //     el.addClass('activeMsg');
        // },0);
        
        if (blurred || tweenNewMessages===false){
            missedMessages++;
            document.title = '('+missedMessages+') Dark Chat';
        }
        msgTime = msg.msgTime;
        fillRstat(msg.msgTime);
    }

    var newStats = false;
    var onP=onlinePersonsCount;
    var acP=activePersonsCount;

    if (isDefined(msg.onlinePersonsCount)){
        onP = msg.onlinePersonsCount;
        newStats = true;
    }

    if (isDefined(msg.activePersonsCount)){
        acP = msg.activePersonsCount;
        newStats = true;
    }

    if(newStats){
        var is_are1 = onP<2?" person is ":" persons are ";
        var is_are2 = acP<2?" is ":" are ";
        if(onP>0&&acP>0){
            $('#lstat').text( onP + is_are1 +"watching, of which "+acP+is_are2+"talking.");
        }else if(onP>0) {
            $('#lstat').text(onP + is_are1 +"watching.");
        }
        // else{
        //     $('#lstat').text("Noone is here. ");
        // }
    }

}

function fillRstat(time){
    var hTime = moment.duration(serverTime-parseInt(time)).humanize() 
    $('#rstat').text("Said "+hTime+" ago");
}

function postMsg(msg){
    if(!socket.connected) notConnected();

    while($('.head').next().length){rollMsgs('right');}
    socket.emit('post',{'msg':msg});
    $( "#inputbox" ).val('');
}

$( "#inputform" ).submit(function( event ) {
    postMsg($( "#inputbox" ).val());
    return false;
});

window.onblur = function() {
    blurred = true;
};

window.onfocus = function() {
    if (document.title != 'Dark Chat') document.title = 'Dark Chat';
    missedMessages=0;
    blurred = false;
};

function isDefined(val) {
    return typeof val!=="undefined";
}

var tweenNewMessages = true;
var activeMsg=null;

function rollMsgs(dir){
    //if($('.newMsg').length===0) return;
    if (activeMsg===null || tweenNewMessages===true) {
        $('.head').removeClass('head');
        activeMsg = $('#msgcon span:last-child');
        activeMsg.addClass('head');
    }

    if(dir==='right'){
        if(activeMsg.next().length){
            tweenNewMessages = false;
            rollLeft(activeMsg);
            $('.head').removeClass('head');
            activeMsg = activeMsg.next();
            activeMsg.addClass('head');
            rollCenter(activeMsg);
            if( $('.newMsg:last-child').is(activeMsg) ) {
                tweenNewMessages = true;
                if (document.title != 'Dark Chat') document.title = 'Dark Chat';
            }
        }
    }

    if(dir==='left'){
        if(activeMsg.prev().length){
            tweenNewMessages = false;
            rollRight(activeMsg);
            $('.head').removeClass('head');
            activeMsg = activeMsg.prev();
            activeMsg.addClass('head');
            rollCenter(activeMsg);
        }
    }
}

function rollLeft(el) {
    TweenMax.to(el, 0.5, {x:"-100%", ease:Power0.easeNone});
}

function rollRight(el) {
    TweenMax.to(el, 0.5, {x:"100%", ease:Power0.easeNone});
}

function rollCenter(el) {
    TweenMax.to(el, 0.5, {x:"0%", ease:Power0.easeNone});
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            rollMsgs('left');
        break;
        
        case 39: // right
            rollMsgs('right');
        break;

        default: return;
    }
    e.preventDefault();
});

function is_touch_device() {
  return 'ontouchstart' in window ||       // works on most browsers 
      navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

if(is_touch_device()){
    Hammer($("#msgcon")[0]).on("swipeleft", function() {rollMsgs('right');});
    Hammer($("#msgcon")[0]).on("swiperight", function() {rollMsgs('left');});
}

$('#colors span').on('click', function(){
    if(!socket.connected) notConnected();
    //console.log($(this).attr('class'));
    var chosenColor = $(this).attr('class');
    socket.emit('color',{"color":chosenColor});
})

function notConnected(){
    $.notify('Still connecting...', {style: 'mystyle'});
}


///////////////// styles

var msgStyles = {
    lacy : {
        c1: '#ff0080',
        c2: '#0000ff',
        x1: -0.3,
        x2: 0.3,
        y1: -0.2,
        y2: 0.2,
        b1: 0.5,
        b2: 0.5,
        basec1: '#00a0a0',
        basec2: '#00a0a0'
    },
    greenie : {
        c1: '#0000ff',
        c2: '#ff00ff',
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0.6,
        b1: 0.4,
        b2: 0.9,
        basec1: '#408040',
        basec2: '#008000'
    }
};

function styleMsg(el, style){
    var split = new SplitText(el, {type: 'words, chars'});
    var numChars = split.chars.length;
    var colors = chroma.scale([style.basec1, style.basec2]).colors(numChars);
    var shadowStyles = [];
    
    var charColorArr = chroma.scale([style.c1, style.c2]).colors(numChars);
    for (var c=0; c<numChars; c++){
        var sx = map(c, 0, numChars, style.x1, style.x2);
        var sy = map(c, 0, numChars, style.y1, style.y2);
        var b = map(c, 0, numChars, style.b1, style.b2);
        var color = charColorArr[c];
        shadowStyles.push(sx+'ex '+sy+'ex '+b+'ex '+color);
    }

    TweenMax.staggerTo(split.chars,0,{cycle:{textShadow:shadowStyles, color:colors}});
}

function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}