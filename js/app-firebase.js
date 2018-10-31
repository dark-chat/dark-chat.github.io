var idToken=null;

firebase.initializeApp({
    apiKey: 'AIzaSyAOHHwRFBRSIfbkLKHidO5gE-cJ1lQ3yWc',
    authDomain: 'dcnew-a525b.firebaseapp.com',
    projectId: 'dcnew-a525b'
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

firebase.auth().signInAnonymously();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        user.getIdToken().then(idToken_ => { idToken=idToken_; })
    }
});

var db_chat_state = db.collection("chat_state").doc('WKn5bqUOJSFPS9s0aR9X');
// db_chat_state.get().then((querySnapshot) => {
//     const initAppObj = {initChatState: querySnapshot.data()};
//     initApp(initAppObj);
// });
db_chat_state.onSnapshot((doc) => {
    const initAppObj = {initChatState: doc.data()};
    initApp(initAppObj);
});

function canPickColor(){
    return false;
}

function canPostMessage(){
    return idToken!==null;
}

function serverChangeUserColor(data){
}

function serverPostMsg(side, msg){
    fetch("https://us-central1-dcnew-a525b.cloudfunctions.net/postMessage", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({side: side, msg: msg, idToken: idToken})
    });
}


