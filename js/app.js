$.notify.addStyle('mystyle', {
  html: "<span data-notify-text/>",
  classes: {
    base: {
      "white-space": "nowrap",
      "background-color": "black",
	  "color": "white",
      "padding": "5px"
    }
  }
});

var socketServer; 
//socketServer = "http://127.0.0.1";
socketServer = "https://dcnew.herokuapp.com";
var socket = io.connect(socketServer);
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

socket.on('connect', function(msg){console.log('Got connected!');}); 

socket.on('disconnect', function(){
    receivedInit=false;
    $('#lstat').text("Lost connection...");
});

socket.on('time',function(msg){ 
    serverTime = parseInt(msg); 
    //$(".spinner").hide(); 
    socket.emit('getInitChatState',{});
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

socket.on('initChatState',function(msg){ 
    activePersonsCount = msg.activePersonsCount;
    onlinePersonsCount = msg.onlinePersonsCount;
    msgTime = msg.msgTime;
    fillData(msg);
    receivedInit=true;
});

//function up(){$.ajax(socketServer+"/l");}up();setInterval(up,50000);
socket.on('updateState',function(msg){
    if(receivedInit===false)return;
    fillData(msg);
});

/* --------- */

function updateTimeago(){
    if(receivedInit===false)return;
    fillRstat(msgTime);
}

function fillData(msg){
    if (isDefined(msg.msg) && isDefined(msg.msgTime) && msg.msg!=cachedMessage){
        cachedMessage=msg.msg;
        $('#msg').text(msg.msg);
        if (blurred){
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
        }else{
            $('#lstat').text("Noone is here. ");
        }
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