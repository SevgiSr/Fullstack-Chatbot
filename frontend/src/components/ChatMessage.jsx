const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div
      className={`flex items-start gap-3.5 my-6 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${
          isUser ? "bg-zinc-700" : "bg-sky-600"
        }`}
      >
        {isUser ? "You" : "AI"}
      </div>
      <div
        className={`max-w-2xl p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-sky-600 text-white"
            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
