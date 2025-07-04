import { useEffect, useRef, useState } from "react";

import { ChatInput, ChatMessage, Sidebar } from "./components";
import { LoadingSpinner, MenuIcon } from "./components/Icons";

const API_URL = "http://localhost:8000/stream_chat";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConvos = JSON.parse(localStorage.getItem("conversations")) || [];
    setConversations(savedConvos);
    const lastThreadId = localStorage.getItem("activeThreadId");
    if (lastThreadId && savedConvos.some((c) => c.id === lastThreadId)) {
      selectConversation(lastThreadId);
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const createNewChat = () => {
    setActiveThreadId(null);
    setMessages([]);
    localStorage.removeItem("activeThreadId");
  };

  const selectConversation = (threadId) => {
    const convo =
      JSON.parse(localStorage.getItem(`conversation_${threadId}`)) || [];
    setMessages(convo);
    setActiveThreadId(threadId);
    localStorage.setItem("activeThreadId", threadId);
    setIsSidebarOpen(false);
  };

  const clearConversations = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all conversations? This cannot be undone."
      )
    ) {
      localStorage.clear();
      setConversations([]);
      setMessages([]);
      setActiveThreadId(null);
    }
  };

  const handleSend = async (userInput) => {
    setIsLoading(true);
    const userMessage = { sender: "user", text: userInput };

    let currentThreadId = activeThreadId;
    let isNewChat = false;
    if (!currentThreadId) {
      isNewChat = true;
      currentThreadId = crypto.randomUUID();
      setActiveThreadId(currentThreadId);
      localStorage.setItem("activeThreadId", currentThreadId);
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Add a placeholder for the AI response
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          thread_id: currentThreadId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponseText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              sender: "ai",
              text: aiResponseText,
            };
          }
          return updated;
        });
      }

      const finalMessages = [
        ...newMessages,
        { sender: "ai", text: aiResponseText },
      ];
      localStorage.setItem(
        `conversation_${currentThreadId}`,
        JSON.stringify(finalMessages)
      );

      if (isNewChat) {
        setConversations((prevConvos) => {
          const newTitle =
            userInput.substring(0, 30) + (userInput.length > 30 ? "..." : "");
          const newConvos = [
            { id: currentThreadId, title: newTitle },
            ...prevConvos,
          ];
          localStorage.setItem("conversations", JSON.stringify(newConvos));
          return newConvos;
        });
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            sender: "ai",
            text: "Sorry, something went wrong. Please check the console and ensure your backend server is running.",
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
      <Sidebar
        conversations={conversations}
        onNewChat={createNewChat}
        onSelectConversation={selectConversation}
        onClearConversations={clearConversations}
        activeThreadId={activeThreadId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
        ></div>
      )}
      <div className="flex flex-col flex-1 w-full">
        <header className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center lg:hidden bg-zinc-50 dark:bg-zinc-900">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold ml-4 text-zinc-900 dark:text-zinc-100">
            Chatbot
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <LoadingSpinner />}
            <div ref={chatEndRef} />
          </div>
        </main>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Home;
