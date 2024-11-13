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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database
const auth = firebase.auth();
const db = firebase.database();

// Google Sign-In function
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
      .then((result) => {
          // User signed in
          const user = result.user;
          console.log("User signed in:", user.displayName);

          // Set username to Google user's display name
          username = user.displayName;

          // Show the chat section and hide the auth section
          document.getElementById("auth-section").style.display = "none";
          document.getElementById("chat-section").style.display = "block";
      })
      .catch((error) => {
          console.error("Error during sign-in:", error.message);
      });
}

// Sign-Out function
function signOut() {
  auth.signOut().then(() => {
      console.log("User signed out");
      document.getElementById("auth-section").style.display = "block";
      document.getElementById("chat-section").style.display = "none";
  }).catch((error) => {
      console.error("Error signing out:", error.message);
  });
}

// Monitor auth state
auth.onAuthStateChanged((user) => {
  if (user) {
      // User is signed in
      username = user.displayName;
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("chat-section").style.display = "block";
  } else {
      // User is signed out
      document.getElementById("auth-section").style.display = "block";
      document.getElementById("chat-section").style.display = "none";
  }
});

// Send message function
function sendMessage(e) {
  e.preventDefault();

  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // Clear the input box
  messageInput.value = "";

  // Auto-scroll to bottom of messages
  document
      .getElementById("messages")
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // Send message data to Firebase
  db.ref("messages/" + timestamp).set({
      username: auth.currentUser.displayName,
      message: message,
      timestamp: timestamp,
  });
}

// Listen for form submission
document.getElementById("message-form").addEventListener("submit", sendMessage);

// Fetch chat messages
const fetchChat = db.ref("messages/");
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${
      auth.currentUser && auth.currentUser.displayName === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;
  document.getElementById("messages").innerHTML += message;
});
