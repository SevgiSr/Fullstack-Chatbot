[![Watch the demo][(https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID)](https://youtu.be/aoBHC6z_ipI)

# Full-Stack LangGraph Chatbot Architecture

This document provides a comprehensive overview of the architecture for the full-stack AI chatbot application.

---

## 1. High-Level Architecture: Client-Server Model

- **Backend:** An API built with **FastAPI** located in the main.py file, and Chatbot class built with **LangGraph** in the chatbot.py file.

- **Frontend:** A **React** application.

---

## 2. The Backend (`/backend`)

The backend is the core of the chatbot's intelligence.

### Key Technologies

- **Language:** Python
- **FastAPI:** A modern, high-performance web framework for building the API.
- **Uvicorn:** The server that runs the FastAPI application.
- **LangGraph:** The framework used to build the stateful, multi-turn AI agent.
- **LangChain:** Provides core utilities, including the `trim_messages` function.

### Setup & Running

1.  Navigate to the `/backend` directory.
2.  Create and activate the virtual environment: `python -m venv .venv` and `.\.venv\Scripts\activate`.
3.  Install dependencies: `pip install -r requirements.txt`.
4.  Create a `.env` file for your `OPENAI_API_KEY`.
5.  Run the server: `uvicorn app.main:app --reload`. The API will be available at `http://127.0.0.1:8000`.

### Core Concepts Explained

#### a. The `Chatbot` Class (`chatbot.py`)

This class encapsulates all the LangGraph logic. It builds and compiles a stateful graph that can:

1.  Receive a list of messages.
2.  Trim the list to a specific token limit to manage context and cost.
3.  Call the AI model with the trimmed list.
4.  Return the AI's response.

#### b. State Management & The Checkpointer

This is the most critical concept for creating a true multi-turn, multi-user chatbot.

- **The Problem:** The backend is stateless. By default, it has no memory of past conversations.
- **The Solution:** LangGraph's **Checkpointer** system. The checkpointer acts as the chatbot's memory. We connect it to our graph when we compile it: `self.agent = graph.compile(checkpointer=self.memory)`.

#### c. `InMemorySaver` vs. Persistent Storage

The type of checkpointer you use determines how durable the memory is.

- **`InMemorySaver` (For Development):**

  - **What it is:** A simple dictionary in the server's RAM.
  - **How it works:** It remembers all conversations as long as the Python server script is running.
  - **The Catch:** If you restart the server, **all conversation history is permanently lost.** This is great for testing but unsuitable for production.

- **`SqliteSaver` (For Production):**
  - **What it is:** A checkpointer that saves the conversation state to a database file (e.g., `my_conversations.db`).
  - **How it works:** To switch to this, you would change one line: `self.memory = SqliteSaver.from_conn_string("my_conversations.db")`.
  - **The Benefit:** Now, if the server restarts, all conversations are safe in the database. A user can return days later, and the chatbot will remember everything. This provides true persistence.

#### d. The `thread_id`

The `thread_id` is the key that unlocks the checkpointer's power. It's like a library card for a specific conversation.

- The **frontend** is responsible for generating a `thread_id` for a new chat and holding onto it.
- With every message, the frontend sends the `user_input` and the `thread_id` to the backend API.
- The **backend** uses this `thread_id` to tell the checkpointer, "Load the history for _this specific conversation_." This is how the system can manage thousands of conversations simultaneously without mixing them up.

---

## 3. The Frontend (`/frontend`)

The frontend is a modern React application designed for a seamless user experience.

### Key Technologies

- **React**
- **Tailwind CSS**
- **`localStorage`**

### Frontend State Management

The frontend manages two types of state, both saved in the browser's `localStorage`:

1.  **Conversation List:** An array of objects, where each object contains a conversation's `id` (the `thread_id`) and `title`. This is used to render the sidebar.
2.  **Message History:** For each `thread_id`, a separate `localStorage` key (e.g., `conversation_123-abc`) stores the full array of messages for that chat. This is purely for displaying the chat history instantly on the UI.

**Crucially, the frontend's message history is for display purposes only.** The backend's checkpointer is the **single source of truth** for the AI's actual memory.

### The Communication Flow (Streaming)

1.  The user types a message and hits send.
2.  The React app adds the user's message to its local state to update the UI immediately.
3.  It makes a `POST` request to the backend's `/stream_chat` endpoint, sending the message and the active `thread_id`.
4.  The backend's `StreamingResponse` starts sending back chunks of text as the AI generates them.
5.  The React app receives these chunks one by one and appends them to the last AI message in its state, creating the real-time "typing" effect.
6.  Once the stream is finished, the final, complete message history is saved back to `localStorage`.

### Summary

InMemorySaver is where LangGraph stores conversations, each conversation is grouped under a unique thread_id. The individual conversation list contains HumanMessage, AIMessage and SystemMessage types.

With every new message being fed to the AI, all past conversation list is fed with it. InMemorySaver makes it possible for the frontend (or any entry point to the script) only send the thread_id to Chatbot, and it will retrieve conversation history for that thread from server's RAM.

When server is restarted, all the history from all threads is lost. To avoid this and make it production ready, use SqliteSaver instead of saving to the RAM.

LocalStorage on the frontend saves conversations for visual purposes only. It does not send them back to the AI with API requests, it only sends the thread_id for that conversation and the new message from user.

**Refreshing the UI:** Because we store conversations and thread_id's in the local_storage, nothing is lost. We can still see past conversations, and we can still send thread_ids to the server and it will retrieve conversation history from it's RAM and the AI will respond accordingly.

**Refreshing the server:** Because currently we did not set up SqliteSaver, refreshing python server will loose past conversation history.
