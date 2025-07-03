const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div
      className={`flex items-start gap-4 my-6 ${isUser ? "justify-end" : ""}`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          AI
        </div>
      )}
      <div
        className={`max-w-lg p-4 rounded-2xl ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold flex-shrink-0">
          You
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
