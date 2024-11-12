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
  
  // Initialize Database
  const db = firebase.database();
  
  // Prompt for username
  const username = prompt("Please Tell Us Your Name");
  
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
      username: username,
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
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    document.getElementById("messages").innerHTML += message;
  });
  