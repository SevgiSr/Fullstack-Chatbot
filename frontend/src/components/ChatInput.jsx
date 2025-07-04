import { useEffect, useRef, useState } from "react";
import { SendIcon } from "./Icons";

const ChatInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // This useEffect hook handles focusing the input box
  useEffect(() => {
    // We focus the input under two conditions:
    // 1. When the component first loads.
    // 2. Whenever the AI has finished responding (isLoading becomes false).
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]); // The effect re-runs whenever 'isLoading' changes.

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSendClick = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div className="px-4 pb-4 sm:px-6 sm:pb-6 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message Chatbot..."
            rows="1"
            className="w-full pl-2 pr-12 py-2.5 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none resize-none overflow-y-hidden"
            style={{ maxHeight: "150px" }}
            disabled={isLoading}
          />
          <button
            onClick={handleSendClick}
            className="absolute right-3 bottom-3 p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:bg-sky-400/50 disabled:cursor-not-allowed transition-colors"
            disabled={!input.trim() || isLoading}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
