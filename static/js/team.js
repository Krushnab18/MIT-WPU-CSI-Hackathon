document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const userId = 'user123'; // Replace with actual user ID
            const createdAt = new Date().toISOString();
            const chatMessage = { userId, message, createdAt };

            // Display message in chat box
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');
            messageElement.innerHTML = `<strong>${userId}:</strong> ${message}`;
            chatBox.appendChild(messageElement);

            // Clear input
            messageInput.value = '';

            // Store message locally in JSON file
            storeMessageLocally(chatMessage);
        }
    });

    function storeMessageLocally(chatMessage) {
        const messages = JSON.parse(localStorage.getItem('teamChatMessages')) || [];
        messages.push(chatMessage);
        localStorage.setItem('teamChatMessages', JSON.stringify(messages));
        saveMessagesToFile(messages);
    }

    function saveMessagesToFile(messages) {
        const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teamChatMessages.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});