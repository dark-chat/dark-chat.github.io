// function getInit() { socket.emit('init', {}); }

// setInterval(function(){
//     if (socket_got_connected){
//         // this runs once
//         socket_got_connected=false;
//         // getInit();
//     }
//     // if(initObj!==null){ initApp(initObj); initObj=null; }
// },10);

// setInterval(function(){
//     // if(serverTime===0)return;
//     // serverTime+=10000;
//     // updateTimeago();
//     pulseInterval++;
//     if(pulseInterval>6){
//         pulseInterval=0;
//         socket.emit('pulse',{});
//     }
// },10000);

// var serverTime = 0;
// var pulseInterval=0;

var socket = io.connect(socketServer);

socket.on('connect', function(){
    console.log('connect');
    socket.emit('init', {});
});

socket.on('disconnect', function(){
    disconnected();
});

socket.on('initObj', function(obj){
    // initObj = obj;
    initApp(obj);
});

socket.on('cmd',function(msg){
    doCmd(msg.cmd, msg.cmdData);
});

socket.on('updateState',function(msg){
    displayData(msg);
});

function isConnected(){
    return socket.connected;
}

function serverChangeUserColor(data){
    socket.emit('color', data);
}

function serverPostMsg(data){
    socket.emit('post', data);
}