class TeamChat {
    constructor() {
        this.chatBox = document.getElementById('chat-box');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.currentUser = this.generateRandomUser(); // For demo purposes
        this.users = new Set();
        this.setupEventListeners();
        this.loadMessages();
        this.setupUserPresence();
    }

    generateRandomUser() {
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomId = Math.floor(Math.random() * 1000);
        return {
            id: `user${randomId}`,
            name: randomName,
            color: this.getRandomColor()
        };
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Typing indicator
        this.messageInput.addEventListener('input', () => this.handleTyping());
    }

    setupUserPresence() {
        // Add user to active users
        this.users.add(this.currentUser);
        this.updateUserList();

        // Simulate other users joining/leaving
        setInterval(() => {
            if (Math.random() > 0.7) {
                const newUser = this.generateRandomUser();
                this.users.add(newUser);
                this.displaySystemMessage(`${newUser.name} joined the chat`);
                this.updateUserList();
            }
        }, 10000);
    }

    updateUserList() {
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        
        this.users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <span class="user-status" style="background-color: ${user.color}"></span>
                <span class="user-name">${user.name}</span>
            `;
            userList.appendChild(userElement);
        });
    }

    handleTyping() {
        // Show typing indicator
        this.displayTypingIndicator();
        
        // Clear previous timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        // Remove typing indicator after delay
        this.typingTimeout = setTimeout(() => {
            this.removeTypingIndicator();
        }, 1000);
    }

    displayTypingIndicator() {
        const existingIndicator = document.querySelector('.typing-indicator');
        if (!existingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = `${this.currentUser.name} is typing...`;
            this.chatBox.appendChild(indicator);
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        }
    }

    removeTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            const messageData = {
                userId: this.currentUser.id,
                userName: this.currentUser.name,
                userColor: this.currentUser.color,
                message,
                timestamp: new Date().toISOString()
            };

            this.displayMessage(messageData);
            this.saveMessage(messageData);
            this.messageInput.value = '';
        }
    }

    displayMessage(messageData) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageData.userId === this.currentUser.id ? 'own-message' : ''}`;
        
        const time = new Date(messageData.timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="user-name" style="color: ${messageData.userColor}">${messageData.userName}</span>
                <span class="timestamp">${time}</span>
            </div>
            <div class="message-content">${messageData.message}</div>
        `;

        this.chatBox.appendChild(messageElement);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    displaySystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'system-message';
        messageElement.textContent = message;
        this.chatBox.appendChild(messageElement);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    saveMessage(messageData) {
        const messages = JSON.parse(localStorage.getItem('teamChatMessages') || '[]');
        messages.push(messageData);
        localStorage.setItem('teamChatMessages', JSON.stringify(messages));
    }

    loadMessages() {
        const messages = JSON.parse(localStorage.getItem('teamChatMessages') || '[]');
        messages.forEach(messageData => this.displayMessage(messageData));
    }
}

// Initialize the chat
document.addEventListener('DOMContentLoaded', () => {
    const teamChat = new TeamChat();
});