import {BUTTON_REMOVE} from "@commons/constants";

import type {ChatId} from "@chat/hooks/useChatCompletionStore";
import useChatCompletionStore from "@chat/hooks/useChatCompletionStore";
import useStorage from "@hooks/useStorage";

const ChatRemoveButton: React.FC<{id: ChatId}> = ({id}) => {
  const chatStore = useChatCompletionStore();
  const storage = useStorage();

  const removeChatHandler = (chatId: ChatId) => {
    chatStore.removeChat(chatId);
    /* if the removed chat is the current one, we reset to a blank chat */
    if (chatId === chatStore.chatId) {
      chatStore.resetCompletions();
      chatStore.resetChatId();
    }
    storage.save();
  };

  return (
    <button
      className={"ascii"}
      style={{userSelect: "none"}}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        removeChatHandler(id);
      }}>
      {BUTTON_REMOVE}
    </button>
  );
};

export default ChatRemoveButton;
