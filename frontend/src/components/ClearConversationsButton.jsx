import { TrashIcon } from "./Icons";

const ClearConversationsButton = ({ onClear }) => (
  <button
    onClick={onClear}
    className="flex items-center gap-x-2 w-full px-2 py-2 text-sm font-medium rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
  >
    <TrashIcon className="w-5 h-5" />
    <span>Clear conversations</span>
  </button>
);

export default ClearConversationsButton;
