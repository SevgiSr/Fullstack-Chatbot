# backend/app/main.py

import logging
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import StreamingResponse
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Import your perfected Chatbot class from the chatbot.py file
# The '.' is crucial - it signifies a relative import from the same package ('app')
from .chatbot import Chatbot

# --- 1. Initialize the FastAPI App ---
# This is the main object that will run our API.
app = FastAPI(
    title="Chatbot API",
    description="An API for interacting with the LangGraph-powered chatbot.",
    version="1.0.0"
)

# --- 2. Configure CORS (Cross-Origin Resource Sharing) ---
# This is a security feature browsers enforce. It's CRITICAL for allowing
# your React frontend (running on http://localhost:3000) to communicate
# with this backend (running on http://localhost:8000).
origins = [
     "http://localhost:3000",
    "http://localhost:5173",  # The default URL for Create React App
    # Add your deployed frontend URL here later, e.g., "https://your-chatbot.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Which origins are allowed to make requests
    allow_credentials=True,      # Allow cookies to be sent
    allow_methods=["*"],         # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all headers
)

# --- 3. Define Data Models (Request and Response) ---
# Using Pydantic models, FastAPI automatically validates incoming request data
# and serializes outgoing response data. It's like defining PropTypes or a
# TypeScript interface for your API.

class ChatRequest(BaseModel):
    """The expected structure of a request to our /chat endpoint."""
    message: str
    # The thread_id is optional. If the frontend doesn't provide one
    # (i.e., it's a new chat), we'll generate a new UUID for it.
    thread_id: str | None = None

class ChatResponse(BaseModel):
    """The structure of the JSON response the API will send back."""
    response: str
    thread_id: str

# --- 4. Create a Singleton Chatbot Instance ---
# We create ONE instance of the Chatbot when the server starts.
# This is efficient because the model is loaded into memory only once,
# not on every single API request.
chatbot_instance = Chatbot()
logging.info("Chatbot instance created and ready.")


# --- 5. Define the API Endpoint ---
# @app.post("/chat") tells FastAPI to create a POST endpoint at the URL /chat.
@app.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    """
    This is the main endpoint for the chatbot.
    It receives a message and an optional thread_id.
    It returns the AI's response and the thread_id for the conversation.
    """
    try:
        # Determine the thread_id. If one wasn't provided, it's a new chat.
        thread_id = request.thread_id or str(uuid.uuid4())
        logging.info(f"Received request for thread_id: {thread_id}")

        # This is the standard LangGraph config object for a conversation thread
        config = {"configurable": {"thread_id": thread_id}}

        # Pass the user's message and the config to our chatbot instance
        ai_response = chatbot_instance.get_response(request.message, config)

        # Return the response in the format defined by our ChatResponse model
        return ChatResponse(response=ai_response, thread_id=thread_id)

    except Exception as e:
        # Basic error handling
        logging.error(f"Error in /chat endpoint for thread_id {request.thread_id}: {e}", exc_info=True)
        # In a real app, you might want more specific error responses
        # For now, we'll re-raise, and FastAPI will turn it into a 500 Internal Server Error
        raise

# --- NEW STREAMING ENDPOINT ---
@app.post("/stream_chat")
async def stream_chat_with_bot(request: ChatRequest):
    """
    This endpoint handles streaming the chatbot's response.
    It returns a StreamingResponse that yields text chunks.
    """
    try:
        thread_id = request.thread_id or str(uuid.uuid4())
        logging.info(f"Received stream request for thread_id: {thread_id}")
        config = {"configurable": {"thread_id": thread_id}}

        # Get the asynchronous generator from our chatbot class
        chunk_generator = chatbot_instance.stream_response(request.message, config)

        # Return a StreamingResponse
        # The media_type 'text/event-stream' is common for Server-Sent Events (SSE)
        # which is a great fit for this kind of streaming.
        return StreamingResponse(chunk_generator, media_type="text/plain")

    except Exception as e:
        logging.error(f"Error in /stream_chat endpoint for thread_id {request.thread_id}: {e}", exc_info=True)
        # You can't return a normal JSON error here as the headers are already sent.
        # The connection will likely just close.
        # Proper error handling in streams is more advanced.
        print(f"An error occurred: {e}")