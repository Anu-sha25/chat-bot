require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { OpenAI } = require('openai');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "Real-Time AI Chat", // Optional. Shows in rankings on openrouter.ai.
    }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io for real-time communication
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Initialize chat session history for this socket connection
    const chatHistory = [
        { role: "system", content: "You are a helpful AI assistant." }
    ];

    // Listen for chat messages from the client
    socket.on('chatMessage', async (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        
        // Add user message to history
        chatHistory.push({ role: "user", content: msg });

        try {
            // Send the entire conversation history to OpenRouter
            const completion = await openai.chat.completions.create({
                model: "openrouter/auto", // Automatically selects the best available model
                messages: chatHistory,
            });

            const responseText = completion.choices[0].message.content;
            
            // Save API response to history
            chatHistory.push({ role: "assistant", content: responseText });

            // Emit the AI's response back to the client
            socket.emit('botMessage', { type: 'success', text: responseText });
        } catch (error) {
            console.error('Error with OpenRouter API:', error);
            socket.emit('botMessage', { type: 'error', text: 'Sorry, I encountered an error communicating with the AI. Please verify your API key.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
