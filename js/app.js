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
    $("#stats").text( msg.msgCount + " Messages. Top words: " + t);
    TweenMax.to("#stats", 0.5, {alpha:1});
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
            if (isDefined(msgStyles[msg.msgColor]) && msg.msg.length>1){
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

$('#msgcon').mousewheel(function(event) {
    if (event.deltaX==-1 || event.deltaY==1){
        rollMsgs('left');
    }
    if (event.deltaX==1 || event.deltaY==-1){
        rollMsgs('right');
    }
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
        fontColors: ['#00a0a0', '#00a0a0'],
        shadowColors: ['#ff0080', '#0000ff'],
        xOffset: [-0.3, 0.3],
        yOffset: [-0.2, 0.2],
        blur: [0.5, 0.5]
    },
    greenie : {
        fontColors: ['#408040', '#008000'],
        shadowColors: ['#0000ff', '#ff00ff'],
        xOffset: [0, 0],
        yOffset: [0, 0.6],
        blur: [0.4, 0.9]
    },
    nimda : {
        fontColors: [brighter('red'), brighter('orange'), brighter('yellow'), brighter('green'), brighter('blue'), brighter('indigo'), brighter('violet')],
        shadowColors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
        xOffset: [-0.2, 0.2],
        yOffset: [-0.2, 0.2],
        blur: [0.8, 0.8]
    }
};

function brighter(c){
    return chroma(c).brighten().get('hex');
}

function styleMsg(el, style){
    var split = new SplitText(el, {type: 'words, chars'});
    var numChars = split.chars.length;
    var colors = chroma.scale(style.fontColors).mode('hsl').colors(numChars);
    var shadowStyles = [];
    
    var charColorArr = chroma.scale(style.shadowColors).colors(numChars);
    for (var c=0; c<numChars; c++){
        var sx = map(c, 0, numChars, style.xOffset[0], style.xOffset[1]);
        var sy = map(c, 0, numChars, style.yOffset[0], style.yOffset[1]);
        var b = map(c, 0, numChars, style.blur[0], style.blur[1]);
        var color = charColorArr[c];
        shadowStyles.push(sx+'ex '+sy+'ex '+b+'ex '+color);
    }

    TweenMax.staggerTo(split.chars,0,{cycle:{textShadow:shadowStyles, color:colors}});
}

function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

Object.keys(msgStyles).map(function(value){
    styleMsg('.'+value, msgStyles[value]);
});


/////////////// cornerbox

$(function(){
    var twPanelHide;

    $('.cornerbutton').on('click', showCornerbox);

    $('.cornerbox').on('focusout', hideCornerbox);

    $('.cornerbutton').hover(showCornerbox);

    function showCornerbox(){
        var el = $('.cornerbox');

        if(twPanelHide)return;
        if(el.hasClass('active'))return;

        console.log('show');
        el.addClass('active').focus();
    }

    function hideCornerbox(){
        console.log('hide');
        var el = $('.cornerbox');
        if(el.hasClass('active')==false)return;
        twPanelHide = TweenMax.to(el.get(0), 0.7, {opacity:0, onComplete:function(){
            el.removeClass('active');
            TweenMax.set(el.get(0), {opacity:1});
            twPanelHide=null;
        }});
    }
});

