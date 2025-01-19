class ChatApp {
    constructor() {
        this.conversationId = this.getOrCreateConversationId();
        this.firstMessageSent = false;
        this.apiKey = ''; // Move this to environment variables
        this.setupEventListeners();
        this.setupAutoResize();
        this.setupTypingIndicator();
        this.setupMessageHistory();
        this.setupSecurityMeasures();
        this.setupLazyLoading();
        this.setupMessageBatching();
    }

    getOrCreateConversationId() {
        return 'conv-' + Math.floor(Math.random() * 1000000);
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
        
        // Render Markdown content
        const converter = new showdown.Converter();
        messageDiv.innerHTML = converter.makeHtml(message);
        
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
        this.firstMessageSent = false;
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

    setupAutoResize() {
        const textarea = document.getElementById('user-input');
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }

    setupTypingIndicator() {
        let typingTimer;
        const userInput = document.getElementById('user-input');
        
        userInput.addEventListener('input', () => {
            clearTimeout(typingTimer);
            // Show typing indicator
            document.querySelector('.status').textContent = 'Typing...';
            
            typingTimer = setTimeout(() => {
                document.querySelector('.status').textContent = 'Active Session';
            }, 1000);
        });
    }

    setupMessageHistory() {
        // Load previous messages from the database
        // This method should be implemented to fetch messages from the database
    }

    setupSecurityMeasures() {
        // Rate limiting
        this.messageCount = 0;
        this.lastMessageTime = Date.now();
        
        // Input sanitization
        this.sanitizeInput = (input) => {
            return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                       .replace(/<[^>]*>/g, '');
        };
    }

    setupLazyLoading() {
        const chatBox = document.getElementById('chat-box');
        const options = {
            root: chatBox,
            rootMargin: '20px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        }, options);

        // Observe images
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }

    setupMessageBatching() {
        this.messageQueue = [];
        this.batchSize = 5;
        
        setInterval(() => {
            if (this.messageQueue.length > 0) {
                const batch = this.messageQueue.splice(0, this.batchSize);
                this.processBatch(batch);
            }
        }, 100);
    }
}

// Initialize the app
const chatApp = new ChatApp();

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';  // Reset input immediately
            await chatApp.handleSendMessage();  // Handle sending the message
        }
    }

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
