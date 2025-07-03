import { PlusIcon } from "./Icons";
import Theme from "./Theme";

const mockConversations = [
  "Introduction to Quantum Computing",
  "My Trip to Japan Itinerary",
  "React vs. Vue: A Deep Dive",
  "Recipe for Sourdough Bread",
  "Workout Plan for Beginners",
  "Introduction to Quantum Computing",
  "My Trip to Japan Itinerary",
  "React vs. Vue: A Deep Dive",
  "Recipe for Sourdough Bread",
  "Workout Plan for Beginners",
  "Introduction to Quantum Computing",
  "My Trip to Japan Itinerary",
  "React vs. Vue: A Deep Dive",
  "Recipe for Sourdough Bread",
  "Workout Plan for Beginners",
  "Introduction to Quantum Computing",
  "My Trip to Japan Itinerary",
  "React vs. Vue: A Deep Dive",
  "Recipe for Sourdough Bread",
  "Workout Plan for Beginners",
  "Introduction to Quantum Computing",
  "My Trip to Japan Itinerary",
  "React vs. Vue: A Deep Dive",
  "Recipe for Sourdough Bread",
  "Workout Plan for Beginners",
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      className={`absolute inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 lg:w-72 flex-shrink-0 z-20`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chatbot
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
        <div className="p-4">
          <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900">
            <PlusIcon className="w-5 h-5 mr-2" />
            New Chat
          </button>
        </div>
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          <h2 className="px-2 mt-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Recent
          </h2>
          {mockConversations.map((convo, index) => (
            <a
              key={index}
              href="#"
              className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
            >
              {convo}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Theme />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
