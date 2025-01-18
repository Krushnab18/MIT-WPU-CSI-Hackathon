class ChatApp {
    constructor() {
        this.conversationId = this.getOrCreateConversationId();
        this.firstMessageSent = false;
        this.apiKey = ''; // Move this to environment variables
        this.setupEventListeners();
    }

    getOrCreateConversationId() {
        return localStorage.getItem('conversationId') || 'conv-' + Math.floor(Math.random() * 1000000);
    }

    setupEventListeners() {
        // Send button click
        document.getElementById('send-btn').addEventListener('click', () => this.handleSendMessage());
        
        // Enter key press
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Clear chat button
        document.querySelector('.clear-chat').addEventListener('click', () => this.clearChat());

        // Export chat button
        document.querySelector('.export-chat').addEventListener('click', () => this.exportChat());

        // File upload handling
        document.getElementById('file-upload').addEventListener('change', (e) => {
            const fileLabel = document.querySelector('.file-upload-wrapper label');
            const fileCount = e.target.files.length;
            fileLabel.textContent = fileCount > 0 ? `${fileCount} files selected` : 'Attach Files';
        });
    }

    async handleSendMessage() {
        const userInput = document.getElementById('user-input').value.trim();
        if (!userInput) return;

        this.displayMessage(userInput, 'user');
        const files = document.getElementById('file-upload').files;
        await this.sendMessage(userInput, files, !this.firstMessageSent);
        
        // Reset input
        document.getElementById('user-input').value = '';
        document.getElementById('file-upload').value = '';
        document.querySelector('.file-upload-wrapper label').textContent = 'Attach Files';
    }

    displayMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = message;
        
        const chatBox = document.getElementById('chat-box');
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async sendMessage(question, files, isFirstMessage) {
        try {
            const formData = new FormData();
            formData.append('question', question);
            formData.append('training_data', 'You are Alex and you are one of the best Financial Analyst who is trained to understand and answer all kinds of financial data.');
            formData.append('model', 'aicon-v4-nano-160824');
            formData.append('conversation_id', this.conversationId);

            if (isFirstMessage && files.length > 0) {
                for (let file of files) {
                    formData.append('files', file, file.name);
                }
            }

            const response = await fetch('https://api.worqhat.com/api/ai/content/v4', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer sk-aeff35723d3c455f91dc477d386b1237`
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok && data.content) {
                this.displayMessage(data.content, 'bot');
                if (isFirstMessage) {
                    this.firstMessageSent = true;
                    localStorage.setItem('conversationId', this.conversationId);
                }
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            this.displayMessage(`Error: ${error.message}`, 'bot');
        }
    }

    clearChat() {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        this.conversationId = this.getOrCreateConversationId();
        this.firstMessageSent = false;
        localStorage.removeItem('conversationId');
    }

    exportChat() {
        const chatBox = document.getElementById('chat-box');
        const messages = Array.from(chatBox.children).map(msg => ({
            type: msg.classList.contains('user') ? 'User' : 'Bot',
            content: msg.textContent
        }));

        const chatContent = messages.map(msg => `${msg.type}: ${msg.content}`).join('\n\n');
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the app
const chatApp = new ChatApp();