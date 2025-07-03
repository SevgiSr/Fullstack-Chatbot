import requests
import uuid # Import the uuid library

# The URL of your running FastAPI server's streaming endpoint
API_URL = "http://127.0.0.1:8000/stream_chat"

# We will maintain the thread_id on the client side for the entire session.
thread_id = None

print("Connected to streaming chat API. Type 'exit' to quit.")
print("-" * 50)

while True:
    try:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        # --- THE FIX IS HERE ---
        # If this is the first message of the session, create a new thread_id.
        if thread_id is None:
            thread_id = str(uuid.uuid4())
            print(f"(Client generated new Thread ID: {thread_id})")

        # Prepare the request payload with the consistent thread_id
        payload = {
            "message": user_input,
            "thread_id": thread_id
        }

        # Make the POST request with stream=True
        with requests.post(API_URL, json=payload, stream=True) as response:
            # Check for HTTP errors
            response.raise_for_status()
            
            print("AI: ", end="", flush=True)
            
            # Iterate over the response content in chunks
            for chunk in response.iter_content(chunk_size=None, decode_unicode=True):
                # Print each chunk as it arrives, without a newline
                print(chunk, end="", flush=True)

            # Print a newline at the end of the full response
            print()

    except requests.exceptions.RequestException as e:
        print(f"\nAn error occurred: {e}")
    except KeyboardInterrupt:
        print("\nExiting.")
        break

### How to Test

""" 
1.  **Start your API server:** In one terminal (in the `backend` folder), run:
    `uvicorn app.main:app --reload`
2.  **Run the test client:** In a *second* terminal (also in the `backend` folder, with the venv active), run:
    `python test_streaming.py`

Now you can chat in the second terminal. You will see the AI's response appear word by word, proving that your streaming implementation is working perfect """