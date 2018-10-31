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
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        // ...
        // console.log(user);
    } else {
        // User is signed out.
        // ...
    }
    // ...
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





