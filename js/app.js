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
        socket.emit('init',{});
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
    $('#lstat').text("Lost connection...");
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
    receivedInit=true;
}

function updateTimeago(){
    if(receivedInit===false)return;
    fillRstat(msgTime);
}

function showStats(msg){
    var r=[]; for (var word in msg.topWords){var freq=msg.topWords[word];r.push({"word":word,"freq":freq})}; r.sort(function(a, b){return a.freq-b.freq;});
    var t=''; for(var c=r.length-1;c>=0;c--){ t=t+r[c].word+"("+r[c].freq+") " }
    $("#statsFill").text( msg.msgCount + " Messages. Top words are " + t);
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
                TweenMax.to(els, 1, {x:"-100%", ease:Power1.easeIn});
            }
        }
        var el = $('<span>');
        el.text(msg.msg);
        $('#msgcon').append(el);
        el.addClass("newMsg");
        if(tweenNewMessages && receivedInit){
            TweenMax.from(el, 1, {x:"100%", ease:Power1.easeOut})
        } else if (tweenNewMessages) {
            TweenMax.set(el, {x:"0%"});
            TweenMax.from(el, 0.5, {alpha:0, ease:Power1.easeOut})
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
    socket.emit('post',{'msg':msg});
    $( "#inputbox" ).val('');
}

$( "#inputbox" ).submit(function( event ) {
    postMsg($( "#inputbox" ).val());
    return false;
});

$( "#inputbtn" ).click(function( event ) {
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
    if (activeMsg===null || tweenNewMessages==true) {
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
    TweenMax.to(el, 1, {x:"-100%", ease:Power0.easeNone});
}

function rollRight(el) {
    TweenMax.to(el, 1, {x:"100%", ease:Power0.easeNone});
}

function rollCenter(el) {
    TweenMax.to(el, 1, {x:"0%", ease:Power0.easeNone});
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

Hammer($("#msgcon")[0]).on("swipeleft", function() {rollMsgs('right');});

Hammer($("#msgcon")[0]).on("swiperight", function() {rollMsgs('left');});