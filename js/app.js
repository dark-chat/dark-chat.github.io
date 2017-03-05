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

setInterval(function(){
    if(serverTime==0)return;
    serverTime+=10000; 
    updateTimeago(); 
},10000); 

socket.on('connect', function(msg){console.log('Got connected!');}); 

socket.on('disconnect', function(){
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

function updateTimeago(){
    if(receivedInit==false)return;
    fillRstat(msgTime);
}

socket.on('initChatState',function(msg){ 
    activePersonsCount = msg.activePersonsCount;
    onlinePersonsCount = msg.onlinePersonsCount;
    msgTime = msg.msgTime;
    fillData(msg)
    receivedInit=true;
});

//function up(){$.ajax(socketServer+"/l");}up();setInterval(up,50000);
socket.on('updateState',function(msg){
    if(receivedInit==false)return;
    fillData(msg)
});

function fillData(msg){
    if (msg['msg']){
        $('#msg').text(msg.msg);
    }
    if (msg['msg']&&msg['msgTime']){
        msgTime = msg.msgTime;
        fillRstat(msg.msgTime);
    }

    var newStats = false;
    var onP=onlinePersonsCount;
    var acP=activePersonsCount;
    if (msg['onlinePersonsCount']){
        onP = msg.onlinePersonsCount;
        newStats = true;
    }
    if (msg['activePersonsCount']){
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

$( "#inputbox" ).submit(function( event ) {
    postMsg($( "#inputbox" ).val());
    $( "#inputbox" ).val('')
    return false;
});

$( "#inputbtn" ).click(function( event ) {
    postMsg($( "#inputbox" ).val());
    $( "#inputbox" ).val('')
    return false;
});

function postMsg(msg){
    socket.emit('post',{'msg':msg});
}