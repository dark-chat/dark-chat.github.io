var initObj=null;
// var socket = io.connect(socketServer, {'transports': ['websocket']});
var socket = io.connect(socketServer);
var socket_got_connected = false;
socket.on('connect', function(msg){socket_got_connected=true; console.log('Got connected!')});

var inputBoxInput = document.querySelector('#inputbox');
inputBoxInput.addEventListener('focus', function(){
    inputBoxInput.setAttribute('data-placeholder', inputBoxInput.getAttribute('placeholder'));
    inputBoxInput.setAttribute('placeholder', '');
});
inputBoxInput.addEventListener('blur', function(){
    inputBoxInput.setAttribute('placeholder', '');
    inputBoxInput.setAttribute('placeholder', inputBoxInput.dataset.placeholder);
});
document.querySelector('#inputbox').focus();