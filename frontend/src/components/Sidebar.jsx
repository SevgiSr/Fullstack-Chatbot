import ClearConversationsButton from "./ClearConversationsButton";
import { MessageSquareIcon, PlusIcon } from "./Icons";
import ThemeSwitcher from "./ThemeSwitcher";

const Sidebar = ({
  conversations,
  onNewChat,
  onSelectConversation,
  onClearConversations,
  activeThreadId,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <div
      className={`absolute inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 w-64 lg:w-72 flex-shrink-0 z-20`}
    >
      <div className="flex flex-col h-full p-2">
        <div className="p-2 flex justify-between items-center">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-900 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Chat
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 ml-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <nav className="flex-1 mt-4 space-y-1 overflow-y-auto">
          {conversations.map((convo) => (
            <a
              key={convo.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectConversation(convo.id);
              }}
              className={`flex items-center gap-x-3 px-2 py-2 text-sm font-medium rounded-md group ${
                activeThreadId === convo.id
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <MessageSquareIcon className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              <span className="truncate flex-1">{convo.title}</span>
            </a>
          ))}
        </nav>
        <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <ClearConversationsButton onClear={onClearConversations} />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
