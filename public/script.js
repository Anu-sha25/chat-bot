document.addEventListener('DOMContentLoaded', () => {
    // Connect to Socket.io server
    const socket = io();

    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.getElementById('typing-indicator');
    const connectionStatus = document.getElementById('connection-status');
    const connectionText = document.getElementById('connection-text');

    // Enable/disable send button based on input
    userInput.addEventListener('input', () => {
        sendButton.disabled = userInput.value.trim() === '';
    });

    // Handle WebSocket connection status
    socket.on('connect', () => {
        connectionStatus.classList.remove('disconnected');
        connectionStatus.classList.add('connected');
        connectionText.textContent = 'Connected';
    });

    socket.on('disconnect', () => {
        connectionStatus.classList.remove('connected');
        connectionStatus.classList.add('disconnected');
        connectionText.textContent = 'Disconnected';
    });

    // Formatting timestamp
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Very basic markdown formatting (bold, code blocks, newlines)
    const formatResponse = (text) => {
        let formatted = text
            // Handle code blocks first
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // Handle inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Handle bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Handle line breaks
            .replace(/\n/g, '<br>');
        
        return formatted;
    };

    // Append a message to the UI
    const appendMessage = (sender, text, type = 'normal') => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        
        if (sender === 'user') {
            msgDiv.classList.add('user-message');
        } else {
            msgDiv.classList.add('ai-message');
            if (type === 'error') {
                msgDiv.classList.add('error-message');
            }
        }

        const formattedText = sender === 'user' ? text : formatResponse(text);

        msgDiv.innerHTML = `
            <div class="message-content">${formattedText}</div>
            <div class="message-timestamp">${getTimestamp()}</div>
        `;

        chatBox.appendChild(msgDiv);
        scrollToBottom();
    };

    const scrollToBottom = () => {
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const setTypingIndicator = (isTyping) => {
        if (isTyping) {
            typingIndicator.classList.remove('hidden');
            scrollToBottom();
        } else {
            typingIndicator.classList.add('hidden');
        }
    };

    // Handle Form Submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = userInput.value.trim();
        if (!text) return;

        // 1. Add user message to UI
        appendMessage('user', text);
        
        // 2. Clear input
        userInput.value = '';
        sendButton.disabled = true;

        // 3. Show typing indicator
        setTypingIndicator(true);

        // 4. Send to server
        socket.emit('chatMessage', text);
    });

    // Listen for AI responses
    socket.on('botMessage', (data) => {
        // 1. Hide typing indicator
        setTypingIndicator(false);

        // 2. Add AI message to UI
        if (data && data.text) {
            appendMessage('ai', data.text, data.type);
        } else {
            appendMessage('ai', 'Error formatting response', 'error');
        }
    });
});
