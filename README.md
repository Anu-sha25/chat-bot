# AI Chat Companion

A real-time AI chat application powered by OpenRouter. This project provides a responsive web interface for conversing with AI models in real-time using WebSocket connections.

## Features

- 🤖 **Real-time AI Responses** - Instant chat with AI models using Socket.io
- 💬 **Conversation History** - Maintains chat context for coherent conversations
- 🎨 **Modern UI** - Clean, responsive design with typing indicators
- ⚡ **Multiple AI Models** - Supports OpenRouter's auto-model selection
- 🔌 **WebSocket Communication** - Low-latency real-time messaging
- 🔒 **Environment-based Configuration** - Secure API key management

## Tech Stack

- **Backend:** Node.js, Express.js, Socket.io
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **API:** OpenRouter (with OpenAI & Google Generative AI support)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

### Setup

1. **Clone or download the project**

   ```bash
   cd chat-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory
   ```
   OPENROUTER_API_KEY=your_api_key_here
   PORT=3001
   ```

## Usage

### Starting the Server

```bash
node server.js
```

The application will be available at `http://localhost:3001`

### Project Structure

```
chat-bot/
├── server.js              # Express server & Socket.io setup
├── package.json           # Dependencies and project metadata
├── public/
│   ├── index.html         # Chat UI markup
│   ├── script.js          # Client-side chat logic
│   └── style.css          # Styles for the chat interface
└── .env                   # Environment variables (create this)
```

## Dependencies

- **express** - Web framework
- **socket.io** - Real-time communication
- **openai** - OpenAI client library
- **@google/generative-ai** - Google AI integration
- **dotenv** - Environment variable management

## How It Works

1. User opens the web interface in a browser
2. Client establishes a Socket.io connection with the server
3. User types a message and sends it
4. Server receives the message via WebSocket
5. Message is added to conversation history
6. OpenRouter API is called with the entire conversation context
7. AI response is sent back to the client in real-time
8. Response is displayed in the chat interface

## Configuration

### API Keys

- **OpenRouter:** Get your API key from [openrouter.ai](https://openrouter.ai)
- Alternative APIs are supported through the same client library

### Custom Settings

In `server.js`, you can customize:

- The AI model: Change `"openrouter/auto"` to a specific model
- System prompt: Modify the initial message in `chatHistory`
- Port: Set `PORT` in your `.env` file

## Future Enhancements

- User authentication
- Chat history persistence
- Message editing and deletion
- User preferences/settings
- Advanced model selection
- File upload support

## Troubleshooting

### Connection Issues

- Verify your API key is correct in `.env`
- Check that the server is running (`node server.js`)
- Ensure port 3001 is not in use

### API Errors

- Check your OpenRouter account balance/quota
- Verify API key permissions
- Review server logs for detailed error messages

## License

ISC

## Author

Created as an AI Chat project

---

For more information about OpenRouter, visit [openrouter.ai](https://openrouter.ai)
