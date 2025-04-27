import {BUTTON_NEW} from "@/commons/constants";

import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";

const ChatNewButton: React.FC = () => {
  const chatStore = useChatCompletionStore();

  const resetChatHandler = () => {
    chatStore.resetCompletions();
    chatStore.resetChatId();
  };

  return (
    <button
      className="ascii"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        resetChatHandler();
      }}>
      {BUTTON_NEW}
    </button>
  );
};

export default ChatNewButton;
