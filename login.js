// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAY6AOSFvt09Y-7cq9B5C7_iEGjvm_RFT4",
    authDomain: "gossip-d7d3e.firebaseapp.com",
    databaseURL: "https://gossip-d7d3e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gossip-d7d3e",
    storageBucket: "gossip-d7d3e.appspot.com",
    messagingSenderId: "769307061033",
    appId: "1:769307061033:web:2a1a5fb2c913217eeda538",
    measurementId: "G-L88BDNDZTJ"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// Google Sign-In
document.getElementById('google-login-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            const userRef = db.ref('users/' + user.uid);

            // Check if the user already has a username
            userRef.once('value', (snapshot) => {
                if (snapshot.exists()) {
                    // If the user exists, redirect to the main chat page
                    window.location.href = "index.html";
                } else {
                    // If user is new, prompt for a username
                    const username = prompt("Welcome! Please create a username:");

                    if (username) {
                        userRef.set({
                            username: username,
                            email: user.email
                        }).then(() => {
                            window.location.href = "index.html";
                        });
                    } else {
                        alert("Username is required to proceed.");
                        auth.signOut();
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error signing in: ", error);
        });
});