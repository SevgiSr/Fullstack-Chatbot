import { useState } from "react";

import { ChatInput, ChatMessage, Sidebar } from "./components";
import { MenuIcon } from "./components/Icons";

// --- Mock Data ---

const mockChatMessages = [
  {
    sender: "ai",
    text: "Hello! I'm your personal AI assistant. How can I help you design something amazing today?",
  },
  {
    sender: "user",
    text: "I need to design a modern chat interface. Can you give me some ideas for a color palette?",
  },
  {
    sender: "ai",
    text: "Of course! For a modern, sleek look, I recommend a dark theme with a charcoal background, slate-gray elements, and a vibrant accent color like electric blue or amethyst purple for interactive elements. For the light theme, a clean white background with light gray accents keeps it feeling fresh and open. How does that sound?",
  },
];

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
        ></div>
      )}

      <div className="flex flex-col flex-1 w-full">
        <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold ml-4">Chat</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {mockChatMessages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </main>

        <ChatInput />
      </div>
    </div>
  );
};

export default Home;
