To test the API:
Open your web browser and go to http://127.0.0.1:8000/docs.
There will be a Swagger UI.
Copy the thread id retrieved from the first response and use it for all your next requests to stay in the same thread and chat context.

## To run the server,

1. Activate the env

```
.\.venv\Scripts\activate
```

2. Run the API

```
uvicorn app.main:app --reload
```
