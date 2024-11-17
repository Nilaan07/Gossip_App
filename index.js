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

auth.onAuthStateChanged(user => {
    const chatHeader = document.getElementById('chat-header');
    const chat = document.getElementById('chat');

    if (!user) {
        window.location.href = "login.html";
    } else {
        const userRef = db.ref('users/' + user.uid);

        userRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                const username = snapshot.val().username;

                // Hide the title initially and show it after authentication
                chatHeader.style.display = "block";
                chat.style.display = "block";

                // Function to handle the send button enable/disable state
document.getElementById("message-input").addEventListener("input", function () {
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("message-btn");
    
    // Enable the send button only if there is text in the input
    if (messageInput.value.trim().length > 0) {
        sendButton.disabled = false;
    } else {
        sendButton.disabled = true;
    }
});

                function sendMessage(e) {
                    e.preventDefault();
                    const messageInput = document.getElementById("message-input");
                    const message = messageInput.value.trim(); // Trim whitespace
                    if (!message) return; // Prevent empty messages from being sent
                
                    messageInput.value = ""; // Clear the input field
                    document.getElementById("message-btn").disabled = true; // Disable the button
                
                    db.ref("messages/" + Date.now()).set({
                        username: username,
                        message: message,
                        timestamp: Date.now(),
                    });
                }
                

                document.getElementById("message-form").addEventListener("submit", sendMessage);

                let lastMessageDate = null;

                db.ref("messages/").on("child_added", function(snapshot) {
                    const messages = snapshot.val();
                    const messageTimestamp = new Date(messages.timestamp);
                
                    const sriLankaTime = new Date(messageTimestamp.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
                    const messageDate = sriLankaTime.toLocaleDateString();
                    const messageTime = sriLankaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                    let displayTimestamp;
                    if (lastMessageDate !== messageDate) {
                        displayTimestamp = `${messageDate}, ${messageTime}`;
                        lastMessageDate = messageDate;
                    } else {
                        displayTimestamp = messageTime;
                    }
                
                    const messageElement = `<li class=${username === messages.username ? "sent" : "receive"}>
                        <span class="timestamp">${displayTimestamp}</span><br>
                        <span>${messages.username}: </span>${messages.message}</li>`;
                
                    // Append new message
                    const messagesContainer = document.getElementById("messages");
                    messagesContainer.innerHTML += messageElement;
                
                    // Scroll to the bottom after new message
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                });
                
            } else {
                auth.signOut().then(() => {
                    window.location.href = "login.html";
                });
            }
        });
    }
});
